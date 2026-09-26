import type { Analysis } from "@/lib/analysis";
import { formatNumber } from "./format";
import { Card } from "./ui";

type Metadata = Analysis["metadata"];
type ProfileFields = Analysis["profile"];

export function MetadataPanel({
  data,
  profile,
}: {
  data: Metadata;
  profile: ProfileFields;
}) {
  if (data.total === 0) {
    return (
      <Card>
        <p className="text-zinc-400">
          Tidak ada repo asli untuk diperiksa kelengkapannya.
        </p>
      </Card>
    );
  }

  const checks: { label: string; filled: number }[] = [
    { label: "Deskripsi", filled: data.withDescription },
    { label: "Lisensi", filled: data.withLicense },
    { label: "Topics", filled: data.withTopics },
    { label: "Homepage", filled: data.withHomepage },
  ];

  return (
    <Card>
      <ul className="space-y-4">
        {checks.map((check) => {
          const missing = data.total - check.filled;
          const complete = missing === 0;
          const ratio = check.filled / data.total;

          return (
            <li key={check.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-4 text-sm">
                <span className="font-medium">{check.label}</span>
                <span
                  className={complete ? "text-zinc-500" : "text-amber-400"}
                >
                  {complete
                    ? `semua ${formatNumber(data.total)} repo`
                    : `${formatNumber(check.filled)}/${formatNumber(data.total)}`}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className={`h-full rounded-full ${
                    complete ? "bg-zinc-400" : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(ratio * 100, 2)}%` }}
                />
              </div>

              {!complete && (
                <p className="mt-1 text-xs text-zinc-500">
                  {formatNumber(missing)} repo belum punya {check.label.toLowerCase()}.
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 border-t border-zinc-800 pt-5">
        <p className="mb-3 text-sm font-medium">Kelengkapan profil</p>
        <ul className="grid gap-2 text-sm sm:grid-cols-3">
          <Field label="Bio" filled={profile.hasBio} />
          <Field label="Lokasi" filled={profile.hasLocation} />
          <Field label="Link / perusahaan" filled={profile.hasLink} />
        </ul>
      </div>

      <p className="mt-5 text-xs text-zinc-500">
        Hanya terisi dari data yang dikembalikan GitHub secara publik. Isi
        README tidak diperiksa karena butuh satu request per repo.
      </p>
    </Card>
  );
}

function Field({ label, filled }: { label: string; filled: boolean }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          filled ? "bg-zinc-400" : "bg-zinc-700"
        }`}
      />
      <span className={filled ? "text-zinc-300" : "text-zinc-500"}>
        {label}
        {!filled && " — kosong"}
      </span>
    </li>
  );
}
