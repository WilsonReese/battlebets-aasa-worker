export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { hostname, pathname, searchParams } = url;

    const isAASAHost = hostname === "aasa.battlebets.app";
    const isAASAPath =
      pathname === "/.well-known/apple-app-site-association" ||
      pathname === "/apple-app-site-association";

    // Serve AASA JSON
    if (isAASAPath) {
      const paths = isAASAHost
        ? [
            "/join", "/join/*",          // allow deep link handoff on aasa.*
            "/join-test", "/join-test/*", // optional
            "/pools" // ✅ added universal link path
          ]
        : [
            "NOT /join", "NOT /join/*",  // force browser landing on join.*
            "/join-test", "/join-test/*" // optional
          ];

      const body = JSON.stringify({
        applinks: {
          apps: [],
          details: [
            {
              appID: "KZH5U4Z5U3.com.battlebets.battlebets",
              paths
            }
          ]
        }
      });

      return new Response(body, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=3600"
        }
      });
    }

    // ✅ Handle direct deep link to open the app or fallback to App Store
    // if (pathname === "/pools") {
    //   return new Response(
    //     `<!DOCTYPE html>
    //     <html>
    //       <head>
    //         <meta charset="utf-8" />
    //         <title>Opening Battle Bets…</title>
    //         <meta name="viewport" content="width=device-width, initial-scale=1" />
    //         <meta http-equiv="refresh" content="0;url=battlebets://open" />
    //         <script>
    //           setTimeout(function() {
    //             window.location.href = "https://battlebets.app";
    //           }, 1500);
    //         </script>
    //       </head>
    //       <body>
    //         <p>Redirecting to Battle Bets…</p>
    //       </body>
    //     </html>`,
    //     {
    //       headers: {
    //         "Content-Type": "text/html; charset=utf-8",
    //         "Cache-Control": "no-store"
    //       }
    //     }
    //   );
    // }
    if (pathname === "/pools") {
      return Response.redirect("https://battlebets.app", 302);
    }


    // Styled "404" page with full-width buttons and Accept Invite (if params present)
    const pool = searchParams.get("pool_id") || "";
    const tok  = searchParams.get("token")   || "";

    // Direct-to-app deep-link host; preserves params for a one-tap open
    const ACCEPT_INVITE =
      pool && tok
        ? `https://join.battlebets.app/join?pool_id=${encodeURIComponent(pool)}&token=${encodeURIComponent(tok)}`
        : "";

    return new Response(renderDownloadHTML({ acceptInviteUrl: ACCEPT_INVITE }), {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
};

function renderDownloadHTML({ acceptInviteUrl }) {
  const APP_STORE = "https://apps.apple.com/us/app/battle-bets/id6738606749";
  const SITE      = "https://battlebets.app";

  // If we have params, show Accept Invite; otherwise show Visit Website
  const ghostHref = acceptInviteUrl || SITE;
  const ghostText = acceptInviteUrl ? "Return to League Invitation" : "Visit our website";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Get Battle Bets</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root { color-scheme: dark light; }
    body {
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      background:#0b1420; color:#fff; margin:0; min-height:100dvh;
      display:grid; place-items:center; padding:24px;
    }
    .card {
      width:100%; max-width:560px; padding:24px; background:#132235;
      border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.25); text-align:center;
    }
    h1 { margin:0 0 8px; }
    p  { margin:8px 0; opacity:.9; }
    .btn {
      display:block; width:100%; box-sizing:border-box; text-align:center;
      padding:14px 16px; margin:10px 0 0; border-radius:12px; text-decoration:none; font-weight:600;
    }
    .btn-primary { background:#3bd17f; color:#0b1420; }
    .btn-ghost   { border:1px solid #3bd17f; color:#3bd17f; background:transparent; }
    small { display:block; margin-top:12px; opacity:.75; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Download Battle Bets</h1>
    <p>You'll need the app installed to open invites.</p>

    <a class="btn btn-primary" href="${APP_STORE}">Download on the App Store</a>
    <a class="btn btn-ghost" href="${ghostHref}">${ghostText}</a>

    <small>After installing, return to your invitation link to join the league.</small>
  </div>
</body>
</html>`;
}