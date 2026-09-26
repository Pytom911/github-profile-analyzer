import Image from "next/image";
import { formatNumber } from "./format";
import { Card, Stat } from "./ui";
import type { GithubUser } from "@/lib/github";

export function ProfileCard({ user }: { user: GithubUser }) {
  return (
    <Card>
      <div className="flex items-start gap-5">
        <Image
          src={user.avatar_url}
          alt={user.login}
          width={80}
          height={80}
          sizes="80px"
          className="h-20 w-20 rounded-full"
        />

        <div className="min-w-0">
          <h2 className="text-2xl font-bold break-words">
            {user.name || user.login}
          </h2>

          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-200"
          >
            @{user.login}
          </a>

          {user.bio && <p className="mt-3 text-zinc-300">{user.bio}</p>}

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
            {user.location && <span>{user.location}</span>}
            {user.company && <span>{user.company}</span>}
            {user.blog && <span>{user.blog}</span>}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Repositories" value={formatNumber(user.public_repos)} />
        <Stat label="Followers" value={formatNumber(user.followers)} />
        <Stat label="Following" value={formatNumber(user.following)} />
        <Stat
          label="Umur profil"
          value={`${Math.floor(yearsSince(user.created_at))} thn`}
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
