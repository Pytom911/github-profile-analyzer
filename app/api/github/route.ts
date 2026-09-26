import { NextRequest } from "next/server";
import { analyze } from "@/lib/analysis";
import { GithubError, getProfile } from "@/lib/github";

const USERNAME_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim() ?? "";

  if (!username) {
    return Response.json(
      { error: "Masukkan username GitHub." },
      { status: 400 }
    );
  }

  if (!USERNAME_PATTERN.test(username)) {
    return Response.json(
      { error: "Format username GitHub tidak valid." },
      { status: 400 }
    );
  }

  try {
    const profile = await getProfile(username);

    return Response.json({ ...profile, analysis: analyze(profile) });
  } catch (error) {
    if (error instanceof GithubError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: "Terjadi kesalahan yang tidak terduga." },
      { status: 500 }
    );
  }
}
