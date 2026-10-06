import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card, Stat } from "./ui";

type Reach = Analysis["reach"];

export function ReachPanel({ data }: { data: Reach }) {
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total Stars" value={formatNumber(data.stars)} />
        <Stat label="Total Forks" value={formatNumber(data.forks)} />
        <Stat label="Median Stars" value={formatNumber(data.medianStars)} />
        <Stat label="Top Repo" value={formatNumber(data.topStars)} />
      </div>

      <p className="mt-5 border-t border-zinc-800 pt-5 text-sm text-zinc-400">
        <span className="font-medium text-zinc-200">
          {formatNumber(data.zeroStarRepos)} repos
        </span>{" "}
        have no stars yet.
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        Median used instead of average, because one high-star repo can skew the average.
      </p>
    </Card>
  );
}
