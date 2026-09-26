import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card, Stat } from "./ui";

type Composition = Analysis["composition"];

export function CompositionPanel({ data }: { data: Composition }) {
  const gap = data.reported - data.analyzed;

  return (
    <Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Repo asli" value={formatNumber(data.own)} />
        <Stat label="Fork" value={formatNumber(data.forks)} />
        <Stat label="Archived" value={formatNumber(data.archived)} />
        <Stat label="Total dianalisis" value={formatNumber(data.analyzed)} />
      </div>

      <div className="mt-5 space-y-2 border-t border-zinc-800 pt-5 text-sm text-zinc-400">
        <p>
          GitHub melaporkan{" "}
          <span className="font-medium text-zinc-200">
            {formatNumber(data.reported)}
          </span>{" "}
          repo publik pada profil ini.
        </p>

        {data.truncated ? (
          <p className="text-amber-400">
            Repo yang dianalisis terpotong pada batas 500 repo, jadi angka di
            atas belum mencakup seluruh repo publik.
          </p>
        ) : gap !== 0 ? (
          <p className="text-amber-400">
            Selisih {formatNumber(Math.abs(gap))} repo belum teranalisis.
          </p>
        ) : (
          <p>Seluruh repo publik yang dilaporkan GitHub sudah dianalisis.</p>
        )}
      </div>
    </Card>
  );
}
