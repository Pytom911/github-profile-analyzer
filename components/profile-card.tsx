import Image from "next/image";
import { formatNumber } from "./format";
import { Card, Stat } from "./ui";
import type { GithubUser } from "@/lib/github";

export function ProfileCard({ user }: { user: GithubUser }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-12 -mr-12 h-40 w-40 rounded-full bg-zinc-800/20 blur-2xl pointer-events-none" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={96}
          height={96}
          sizes="96px"
          className="h-24 w-24 rounded-2xl border border-zinc-700/50 shadow-md object-cover"
        />

        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-white break-words">
            {user.name || user.login}
          </h2>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-0.5 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            @{user.login} ↗
          </a>

          {user.bio && <p className="mt-3 text-sm text-zinc-300 leading-relaxed">{user.bio}</p>}

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-zinc-400">
            {user.location && (
              <span className="flex items-center gap-1.5">
                📍 {user.location}
              </span>
            )}
            {user.company && (
              <span className="flex items-center gap-1.5">
                🏢 {user.company}
              </span>
            )}
            {user.blog && (
              <span className="flex items-center gap-1.5">
                🔗 {user.blog}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Repositories" value={formatNumber(user.public_repos)} />
        <Stat label="Followers" value={formatNumber(user.followers)} />
        <Stat label="Following" value={formatNumber(user.following)} />
        <Stat
          label="Profile Age"
          value={`${Math.floor(yearsSince(user.created_at))} yrs`}
        />
      </div>
    </Card>
  );
}

function yearsSince(iso: string) {
  const created = Date.parse(iso);
  if (Number.isNaN(created)) return 0;
  return (Date.now() - created) / (365.25 * 86_400_000);
}
