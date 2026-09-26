import type { GithubProfile, GithubRepo } from "./github";

export type LanguageSlice = {
  language: string;
  repos: number;
  stars: number;
  share: number;
};

export type Analysis = {
  language: LanguageSlice[];
  composition: {
    reported: number;
    analyzed: number;
    own: number;
    forks: number;
    archived: number;
    truncated: boolean;
  };
  activity: {
    last30: number;
    last90: number;
    last365: number;
    daysSincePush: number | null;
  };
  reach: {
    stars: number;
    forks: number;
    medianStars: number;
    topStars: number;
    zeroStarRepos: number;
  };
  metadata: {
    total: number;
    withDescription: number;
    withLicense: number;
    withTopics: number;
    withHomepage: number;
  };
  profile: {
    hasBio: boolean;
    hasLocation: boolean;
    hasLink: boolean;
    ageYears: number;
  };
};

const DAY_MS = 86_400_000;

export function analyze(profile: GithubProfile): Analysis {
  const { user, repos, truncated } = profile;
  const own = repos.filter((repo) => !repo.fork);
  const now = Date.now();

  return {
    language: languages(own),
    composition: {
      reported: user.public_repos,
      analyzed: repos.length,
      own: own.length,
      forks: repos.length - own.length,
      archived: repos.filter((repo) => repo.archived).length,
      truncated,
    },
    activity: {
      last30: pushedWithin(own, now, 30),
      last90: pushedWithin(own, now, 90),
      last365: pushedWithin(own, now, 365),
      daysSincePush: daysSince(own, now),
    },
    reach: {
      stars: sum(own, (repo) => repo.stargazers_count),
      forks: sum(own, (repo) => repo.forks_count),
      medianStars: median(own.map((repo) => repo.stargazers_count)),
      topStars: own.reduce(
        (max, repo) => Math.max(max, repo.stargazers_count),
        0
      ),
      zeroStarRepos: own.filter((repo) => repo.stargazers_count === 0).length,
    },
    metadata: {
      total: own.length,
      withDescription: count(own, (repo) => Boolean(repo.description)),
      withLicense: count(own, (repo) => Boolean(repo.license)),
      withTopics: count(own, (repo) => repo.topics.length > 0),
      withHomepage: count(own, (repo) => Boolean(repo.homepage)),
    },
    profile: {
      hasBio: Boolean(user.bio),
      hasLocation: Boolean(user.location),
      hasLink: Boolean(user.blog || user.company),
      ageYears: yearsSince(user.created_at, now),
    },
  };
}

function languages(own: GithubRepo[]): LanguageSlice[] {
  const counts = new Map<string, { repos: number; stars: number }>();

  for (const repo of own) {
    if (!repo.language) continue;
    const entry = counts.get(repo.language) ?? { repos: 0, stars: 0 };
    entry.repos += 1;
    entry.stars += repo.stargazers_count;
    counts.set(repo.language, entry);
  }

  const slices = [...counts.entries()].map(([language, entry]) => ({
    language,
    repos: entry.repos,
    stars: entry.stars,
    share: 0,
  }));

  const totalRepos = slices.reduce((total, slice) => total + slice.repos, 0);
  if (totalRepos > 0) {
    for (const slice of slices) {
      slice.share = slice.repos / totalRepos;
    }
  }

  return slices.sort((a, b) => b.repos - a.repos || b.stars - a.stars);
}

function pushedWithin(own: GithubRepo[], now: number, days: number) {
  return own.filter(
    (repo) => now - Date.parse(repo.pushed_at) <= days * DAY_MS
  ).length;
}

function daysSince(own: GithubRepo[], now: number): number | null {
  const latest = own.reduce((max, repo) => {
    const at = Date.parse(repo.pushed_at);
    return at > max ? at : max;
  }, 0);

  if (latest === 0) return null;
  return Math.floor((now - latest) / DAY_MS);
}

function sum(own: GithubRepo[], pick: (repo: GithubRepo) => number) {
  return own.reduce((total, repo) => total + pick(repo), 0);
}

function count(own: GithubRepo[], test: (repo: GithubRepo) => boolean) {
  return own.reduce((total, repo) => total + (test(repo) ? 1 : 0), 0);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function yearsSince(iso: string, now: number): number {
  const created = Date.parse(iso);
  if (Number.isNaN(created)) return 0;
  return (now - created) / (365.25 * DAY_MS);
}
