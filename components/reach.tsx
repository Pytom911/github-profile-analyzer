import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card, Stat } from "./ui";

type Reach = Analysis["reach"];

export function ReachPanel({ data }: { data: Reach }) {
  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total bintang" value={formatNumber(data.stars)} />
        <Stat label="Total fork" value={formatNumber(data.forks)} />
        <Stat label="Median bintang" value={formatNumber(data.medianStars)} />
        <Stat label="Tertinggi" value={formatNumber(data.topStars)} />
      </div>

      <p className="mt-5 border-t border-zinc-800 pt-5 text-sm text-zinc-400">
        <span className="font-medium text-zinc-200">
          {formatNumber(data.zeroStarRepos)} repo
        </span>{" "}
        belum punya bintang sama sekali.
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        Median dipakai, bukan rata-rata, karena satu repo dengan bintang tinggi
        bisa membuat rata-rata terlihat lebih baik dari kenyataannya.
      </p>
    </Card>
  );
}
