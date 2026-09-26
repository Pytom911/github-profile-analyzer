import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card } from "./ui";

type Activity = Analysis["activity"];

export function ActivityPanel({ data }: { data: Activity }) {
  const buckets = [
    { label: "30 hari terakhir", value: data.last30 },
    { label: "90 hari terakhir", value: data.last90 },
    { label: "12 bulan terakhir", value: data.last365 },
  ];

  return (
    <Card>
      <ul className="space-y-3">
        {buckets.map((bucket) => (
          <li
            key={bucket.label}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-zinc-400">{bucket.label}</span>
            <span className="font-medium">
              {formatNumber(bucket.value)} repo
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-zinc-800 pt-5 text-sm text-zinc-400">
        Push terakhir:{" "}
        <span className="font-medium text-zinc-200">
          {data.daysSincePush === null
            ? "tidak ada data"
            : `${formatNumber(data.daysSincePush)} hari lalu`}
        </span>
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        Dihitung dari push terakhir di repo asli, bukan dari waktu repo dibuat.
      </p>
    </Card>
  );
}
