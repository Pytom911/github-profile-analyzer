import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card, Stat } from "./ui";

type Composition = Analysis["composition"];

export function CompositionPanel({ data }: { data: Composition }) {
  const gap = data.reported - data.analyzed;

  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Original" value={formatNumber(data.own)} />
        <Stat label="Forks" value={formatNumber(data.forks)} />
        <Stat label="Archived" value={formatNumber(data.archived)} />
        <Stat label="Analyzed" value={formatNumber(data.analyzed)} />
      </div>

      <div className="mt-5 space-y-2 border-t border-zinc-800 pt-5 text-sm text-zinc-400">
        <p>
          GitHub reports{" "}
          <span className="font-medium text-zinc-200">
            {formatNumber(data.reported)}
          </span>{" "}
          public repositories for this profile.
        </p>

        {data.truncated ? (
          <p className="text-amber-400">
            Analysis is capped at 500 repositories, so the numbers above do not cover all public repos.
          </p>
        ) : gap !== 0 ? (
          <p className="text-amber-400">
            {formatNumber(Math.abs(gap))} repositories were not yet analyzed.
          </p>
        ) : (
          <p>All public repositories reported by GitHub have been analyzed.</p>
        )}
      </div>
    </Card>
  );
}
