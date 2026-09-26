const GITHUB_API = "https://api.github.com";

const MAX_REPO_PAGES = 5;

export type GithubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
};

export type GithubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  license: string | null;
  homepage: string | null;
  pushed_at: string;
};

export type GithubProfile = {
  user: GithubUser;
  repos: GithubRepo[];
  truncated: boolean;
};

type RawUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  blog: string | null;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
};

type RawRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[] | undefined;
  fork: boolean;
  archived: boolean;
  license: { spdx_id: string | null } | null;
  homepage: string | null;
  pushed_at: string;
};

export class GithubError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GithubError";
    this.status = status;
  }
}

async function githubFetch<T>(url: string): Promise<{ data: T; link: string | null }> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-profile-analyzer",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw await toGithubError(response);
  }

  return {
    data: (await response.json()) as T,
    link: response.headers.get("link"),
  };
}

async function toGithubError(response: Response): Promise<GithubError> {
  if (response.status === 404) {
    return new GithubError("Username GitHub tidak ditemukan.", 404);
  }

  if (response.status === 401) {
    return new GithubError(
      "GITHUB_TOKEN tidak valid. Cek ulang token di .env.local.",
      500
    );
  }

  if (response.status === 403 || response.status === 429) {
    return new GithubError(rateLimitMessage(response), 429);
  }

  return new GithubError("Gagal mengambil data dari GitHub.", 502);
}

function rateLimitMessage(response: Response): string {
  const remaining = response.headers.get("x-ratelimit-remaining");
  const reset = response.headers.get("x-ratelimit-reset");

  if (remaining === "0" && reset) {
    const minutes = Math.max(
      1,
      Math.ceil((Number(reset) * 1000 - Date.now()) / 60_000)
    );
    return `Rate limit GitHub tercapai. Coba lagi dalam ${minutes} menit.`;
  }

  return "Rate limit GitHub tercapai. Coba lagi nanti.";
}

function nextPageUrl(link: string | null): string | null {
  if (!link) return null;

  for (const part of link.split(",")) {
    const match = part.match(/<([^>]+)>\s*;\s*rel="next"/);
    if (match) return match[1];
  }

  return null;
}

async function fetchAllRepos(encoded: string) {
  const collected: GithubRepo[] = [];
  let url: string | null = `${GITHUB_API}/users/${encoded}/repos?per_page=100&sort=updated`;
  let pages = 0;

  while (url && pages < MAX_REPO_PAGES) {
    const { data, link } = await githubFetch<RawRepo[]>(url);
    collected.push(...data.map(toRepo));
    url = nextPageUrl(link);
    pages += 1;
  }

  return { repos: collected, truncated: url !== null };
}

export async function getProfile(username: string): Promise<GithubProfile> {
  const encoded = encodeURIComponent(username);

  const [{ data: rawUser }, { repos, truncated }] = await Promise.all([
    githubFetch<RawUser>(`${GITHUB_API}/users/${encoded}`),
    fetchAllRepos(encoded),
  ]);

  return { user: toUser(rawUser), repos, truncated };
}

function toUser(raw: RawUser): GithubUser {
  return {
    login: raw.login,
    name: raw.name,
    avatar_url: raw.avatar_url,
    bio: raw.bio,
    location: raw.location,
    company: raw.company,
    blog: raw.blog,
    followers: raw.followers,
    following: raw.following,
    public_repos: raw.public_repos,
    created_at: raw.created_at,
    html_url: raw.html_url,
  };
}

function toRepo(raw: RawRepo): GithubRepo {
  return {
    id: raw.id,
    name: raw.name,
    html_url: raw.html_url,
    description: raw.description,
    stargazers_count: raw.stargazers_count,
    forks_count: raw.forks_count,
    language: raw.language,
    topics: raw.topics ?? [],
    fork: raw.fork,
    archived: raw.archived,
    license: raw.license?.spdx_id ?? null,
    homepage: raw.homepage && raw.homepage.length > 0 ? raw.homepage : null,
    pushed_at: raw.pushed_at,
  };
}
