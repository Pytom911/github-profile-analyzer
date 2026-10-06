"use client";

import { useMemo, useState } from "react";
import { formatNumber } from "./format";
import { Card } from "./ui";
import type { GithubRepo } from "@/lib/github";

type Sort = "stars" | "recent";

export function RepoList({ repos }: { repos: GithubRepo[] }) {
  const [sort, setSort] = useState<Sort>("stars");

  const sorted = useMemo(() => {
    const copy = [...repos];

    return copy.sort((a, b) =>
      sort === "stars"
        ? b.stargazers_count - a.stargazers_count
        : Date.parse(b.pushed_at) - Date.parse(a.pushed_at)
    );
  }, [repos, sort]);

  return (
    <div>
      <div className="mb-6 flex gap-2">
        <SortButton
          label="Most Starred"
          active={sort === "stars"}
          onClick={() => setSort("stars")}
        />
        <SortButton
          label="Recently Pushed"
          active={sort === "recent"}
          onClick={() => setSort("recent")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sorted.map((repo) => (
          <Card key={repo.id} className="group relative overflow-hidden transition-all hover:border-zinc-700/80">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-white break-all group-hover:text-zinc-300 transition-colors">{repo.name}</h3>
                <div className="flex shrink-0 gap-1.5">
                  {repo.fork && <Badge label="fork" />}
                  {repo.archived && <Badge label="archived" />}
                </div>
              </div>

              <p className="mt-2.5 min-h-12 text-sm text-zinc-400">
                {repo.description || "No description provided."}
              </p>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-zinc-400">
                <span>⭐ {formatNumber(repo.stargazers_count)}</span>
                <span>🍴 {formatNumber(repo.forks_count)}</span>
                {repo.language && <span>{repo.language}</span>}
                {repo.license && <span>{repo.license}</span>}
              </div>

              {repo.topics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {repo.topics.slice(0, 4).map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full bg-zinc-800/60 px-2 py-0.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SortButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-zinc-600 bg-zinc-800 text-white"
          : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
      }`}
    >
      {label}
    </button>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-zinc-800/80 px-2 py-0.5 text-xs font-medium text-zinc-300">
      {label}
    </span>
  );
}
