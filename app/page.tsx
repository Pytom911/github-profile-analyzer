"use client";

import { FormEvent, useState } from "react";
import { ActivityPanel } from "@/components/activity";
import { CompositionPanel } from "@/components/composition";
import { LanguageBars } from "@/components/language-bars";
import { MetadataPanel } from "@/components/metadata";
import { ProfileCard } from "@/components/profile-card";
import { ReachPanel } from "@/components/reach";
import { RepoList } from "@/components/repo-list";
import { Section } from "@/components/ui";
import type { Analysis } from "@/lib/analysis";
import type { GithubRepo, GithubUser } from "@/lib/github";

type Result = {
  user: GithubUser;
  repos: GithubRepo[];
  analysis: Analysis;
};

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!username.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/github?username=${encodeURIComponent(username)}`
      );

      const data: Result | { error: string } = await response.json();

      if (!response.ok || "error" in data) {
        throw new Error(
          "error" in data ? data.error : "Terjadi kesalahan"
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm text-zinc-400">
            GitHub Profile Analyzer
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Analyze any GitHub profile
          </h1>

          <p className="mt-4 text-zinc-400">
            Masukkan username GitHub untuk melihat statistik
            dan repository.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-xl gap-3"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="contoh: torvalds"
            aria-label="Username GitHub"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none focus:border-zinc-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-white px-5 py-3 font-medium text-black disabled:opacity-50"
          >
            {loading ? "Loading..." : "Analyze"}
          </button>
        </form>

        {error && (
          <p className="mx-auto mt-6 max-w-xl text-center text-red-400">
            {error}
          </p>
        )}

        {result && <Report result={result} />}
      </div>
    </main>
  );
}

function Report({ result }: { result: Result }) {
  const { user, repos, analysis } = result;

  return (
    <>
      <section className="mt-12">
        <ProfileCard user={user} />
      </section>

      <Section
        title="Bahasa"
        hint="Bahasa yang terdeteksi pada repo asli, diurutkan dari yang paling banyak."
      >
        <LanguageBars slices={analysis.language} />
      </Section>

      <Section
        title="Komposisi repository"
        hint="Memisahkan karya sendiri dari fork, karena keduanya berpengaruh berbeda."
      >
        <CompositionPanel data={analysis.composition} />
      </Section>

      <Section
        title="Aktivitas"
        hint="Berapa banyak repo yang benar-benar menerima push baru-baru ini."
      >
        <ActivityPanel data={analysis.activity} />
      </Section>

      <Section
        title="Jangkauan"
        hint="Jumlah bintang dan fork yang dikumpulkan oleh repo asli."
      >
        <ReachPanel data={analysis.reach} />
      </Section>

      <Section
        title="Kelengkapan metadata"
        hint="Berapa banyak repo yang sudah diisi lengkap, dan mana yang masih kosong."
      >
        <MetadataPanel data={analysis.metadata} profile={analysis.profile} />
      </Section>

      <Section title={`Repository (${repos.length})`}>
        <RepoList repos={repos} />
      </Section>
    </>
  );
}
