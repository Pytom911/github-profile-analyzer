import type { LanguageSlice } from "@/lib/analysis";
import { formatNumber, formatPercent } from "./format";
import { Card } from "./ui";

const LINGUIST: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  "C#": "#178600",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Shell: "#89e051",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  C: "#555555",
  "C++": "#f34b7d",
  Blade: "#f7523f",
};

const FALLBACK = "#8b949e";

export function LanguageBars({ slices }: { slices: LanguageSlice[] }) {
  if (slices.length === 0) {
    return (
      <Card>
        <p className="text-zinc-400">
          Tidak ada repo yang mendeteksi bahasa pemrograman.
        </p>
      </Card>
    );
  }

  const totalRepos = slices.reduce((total, slice) => total + slice.repos, 0);

  return (
    <Card>
      <ul className="space-y-4">
        {slices.map((slice) => {
          const color = LINGUIST[slice.language] ?? FALLBACK;

          return (
            <li key={slice.language}>
              <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {slice.language}
                </span>
                <span className="shrink-0 text-zinc-500">
                  {slice.repos} repo · {formatPercent(slice.share)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(slice.share * 100, 2)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 text-xs text-zinc-500">
        Persentase dihitung dari total {formatNumber(totalRepos)} repo yang
        terdeteksi bahasanya. Fork tidak dihitung.
      </p>
    </Card>
  );
}
