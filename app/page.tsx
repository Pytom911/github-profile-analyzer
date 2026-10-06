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
import { SITE } from "@/lib/site";

type Result = {
  user: GithubUser;
  repos: GithubRepo[];
  analysis: Analysis;
};

const SUGGESTIONS = ["torvalds", "sindresorhus", "gaearon", "yyx990803"];

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const handle = username.trim().replace(/^@/, "");

    if (!handle) {
      setError("Enter a GitHub username to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        `/api/github?username=${encodeURIComponent(handle)}`
      );

      const data: Result | { error: string } = await response.json();

      if (!response.ok || "error" in data) {
        throw new Error(
          "error" in data ? data.error : "Something went wrong."
        );
      }

      setResult(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <div className="mx-auto w-full max-w-5xl flex-1 px-5 py-14 sm:px-8 sm:py-20">
        <header className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1 text-xs font-medium tracking-wide text-zinc-400">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Reads public GitHub data
          </span>

          <h1 className="mx-auto mt-6 max-w-2xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            See what a GitHub profile is actually made of
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-zinc-400">
            Look past the follower count. Break down languages, forks, activity
            and metadata completeness across every public repository.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. torvalds"
            aria-label="GitHub username"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-medium text-black transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Spinner />
                Analyzing
              </>
            ) : (
              "Analyze"
            )}
          </button>
        </form>

        {error && (
          <p
            role="alert"
            className="mx-auto mt-4 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {!result && !error && (
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-zinc-500">Try</span>
            {SUGGESTIONS.map((handle) => (
              <button
                key={handle}
                type="button"
                onClick={() => setUsername(handle)}
                className="rounded-full border border-zinc-800 px-2.5 py-1 font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
              >
                {handle}
              </button>
            ))}
          </div>
        )}

        {result && <Report result={result} />}
      </div>

      <Footer />
    </main>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-4 animate-spin rounded-full border-2 border-black/25 border-t-black"
    />
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-5 py-10 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-300">
            Built by{" "}
            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white underline decoration-zinc-700 underline-offset-4 transition-colors hover:decoration-zinc-400"
            >
              {SITE.author}
            </a>
          </p>
          <p className="text-xs text-zinc-500">
            If you like this app, feel free to ask for a star on GitHub. It
            helps other people find it.
          </p>
        </div>

        <a
          href={SITE.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-700 hover:bg-zinc-800"
        >
          <StarIcon />
          Star on GitHub
        </a>
      </div>
    </footer>
  );
}

function StarIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="currentColor"
      className="size-4"
    >
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

function Report({ result }: { result: Result }) {
  const { user, repos, analysis } = result;

  return (
    <>
      <section className="mt-14">
        <ProfileCard user={user} />
      </section>

      <Section
        title="Languages"
        hint="Detected in original repositories, ranked by how many repos use them."
      >
        <LanguageBars slices={analysis.language} />
      </Section>

      <Section
        title="Repository composition"
        hint="Separates original work from forks, because the two carry very different weight."
      >
        <CompositionPanel data={analysis.composition} />
      </Section>

      <Section
        title="Activity"
        hint="How many repositories actually received a push recently."
      >
        <ActivityPanel data={analysis.activity} />
      </Section>

      <Section
        title="Reach"
        hint="Stars and forks collected by original repositories."
      >
        <ReachPanel data={analysis.reach} />
      </Section>

      <Section
        title="Metadata completeness"
        hint="Which repositories are fully described, and which are still missing basics."
      >
        <MetadataPanel data={analysis.metadata} profile={analysis.profile} />
      </Section>

      <Section title={`Repositories (${repos.length})`}>
        <RepoList repos={repos} />
      </Section>
    </>
  );
}
