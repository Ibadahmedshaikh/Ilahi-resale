import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const isConfigured =
  SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 10;

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page — always allow, no auth check
  if (pathname === "/admin-login") {
    return NextResponse.next({ request });
  }

  // Non-admin routes — pass through after refreshing session cookie
  if (!pathname.startsWith("/admin")) {
    if (!isConfigured) return NextResponse.next({ request });

    let supabaseResponse = NextResponse.next({ request });
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });
    await supabase.auth.getUser();
    return supabaseResponse;
  }

  // /admin routes — require authentication
  if (!isConfigured) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/admin-login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
