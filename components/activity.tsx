import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card } from "./ui";

type Activity = Analysis["activity"];

export function ActivityPanel({ data }: { data: Activity }) {
  const buckets = [
    { label: "Last 30 days", value: data.last30 },
    { label: "Last 90 days", value: data.last90 },
    { label: "Last 365 days", value: data.last365 },
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
            <span className="font-medium text-white">
              {formatNumber(bucket.value)} repo
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 border-t border-zinc-800 pt-5 text-sm text-zinc-400">
        Last push:{" "}
        <span className="font-medium text-zinc-200">
          {data.daysSincePush === null
            ? "No data"
            : `${formatNumber(data.daysSincePush)} days ago`}
        </span>
      </p>

      <p className="mt-2 text-xs text-zinc-500">
        Counted from the latest push in original repositories, not creation time.
      </p>
    </Card>
  );
}
