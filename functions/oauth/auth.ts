/**
 * Cloudflare Pages Function: memulai login GitHub untuk Decap CMS (/admin).
 *
 *   GET /oauth/auth?provider=github  → redirect ke halaman otorisasi GitHub
 *
 * Environment variable: GITHUB_OAUTH_CLIENT_ID (wajib).
 * Callback URL di GitHub OAuth App harus: https://pojokbola.web.id/oauth/callback
 * State disimpan di cookie HttpOnly untuk mencegah CSRF.
 */
interface Env {
  GITHUB_OAUTH_CLIENT_ID?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  if (!clientId) {
    return new Response('Login admin belum dikonfigurasi.', { status: 503 });
  }

  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', new URL('/oauth/callback', request.url).toString());
  authorize.searchParams.set('scope', 'repo');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Cache-Control': 'no-store',
      'Set-Cookie': `pb_oauth_state=${state}; Max-Age=600; Path=/oauth; HttpOnly; Secure; SameSite=Lax`,
    },
  });
};
