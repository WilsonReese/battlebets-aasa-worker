// export default {
//   async fetch(request) {
//     const { hostname, pathname } = new URL(request.url);

//     const isAASAHost = hostname === "aasa.battlebets.app";
//     const isAASAPath =
//       pathname === "/.well-known/apple-app-site-association" ||
//       pathname === "/apple-app-site-association";

//     if (!isAASAPath) return new Response("You must download the Battle Bets app first. Go back, download the app, and try again.", { status: 404 });

//     const paths = isAASAHost
//       ? [
//           "/join", "/join/*",           // allow deep link handoff here
//           "/join-test", "/join-test/*"  // optional
//         ]
//       : [
//           "NOT /join", "NOT /join/*",   // force browser on join.battlebets.app
//           "/join-test", "/join-test/*"  // optional
//         ];

//     const body = JSON.stringify({
//       applinks: {
//         apps: [],
//         details: [
//           {
//             appID: "KZH5U4Z5U3.com.battlebets.battlebets",
//             paths
//           }
//         ]
//       }
//     });

//     return new Response(body, {
//       headers: {
//         "Content-Type": "application/json",
//         "Cache-Control": "max-age=3600"
//       }
//     });
//   }
// }

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { hostname, pathname } = url;

    const isAASAHost = hostname === "aasa.battlebets.app";
    const isAASAPath =
      pathname === "/.well-known/apple-app-site-association" ||
      pathname === "/apple-app-site-association";

    // Serve the AASA JSON (unchanged)
    if (isAASAPath) {
      const paths = isAASAHost
        ? [
            "/join", "/join/*",          // allow deep link handoff on aasa.*
            "/join-test", "/join-test/*" // optional
          ]
        : [
            "NOT /join", "NOT /join/*",  // force browser on join.*
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

    // Everything else: styled HTML "404" with a Download button
    return new Response(renderDownloadHTML(), {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }
};

function renderDownloadHTML() {
  const APP_STORE = "https://apps.apple.com/us/app/battle-bets/id6738606749";
  const SITE      = "https://battlebets.app";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Get Battle Bets</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    :root { color-scheme: dark light; }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
           background:#0b1420; color:#fff; margin:0; min-height:100dvh;
           display:grid; place-items:center; padding:24px; }
    .card { width:100%; max-width:560px; padding:24px; background:#132235;
            border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,.25);
            text-align:center; }
    h1 { margin:0 0 8px; }
    p  { margin:8px 0; opacity:.9; }
    .btn { display:inline-block; padding:12px 16px; margin:10px 8px 0;
           border-radius:12px; text-decoration:none; font-weight:600; }
    .btn-primary { background:#3bd17f; color:#0b1420; }
    .btn-ghost   { border:1px solid #3bd17f; color:#3bd17f; }
    small { display:block; margin-top:10px; opacity:.75; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Download Battle Bets</h1>
    <p>You’ll need the app installed to open invites.</p>

    <a class="btn btn-primary" href="${APP_STORE}">Download on the App Store</a>
    <a class="btn btn-ghost" href="${SITE}">Visit our website</a>

    <small>After installing, return to your invite link.</small>
  </div>
</body>
</html>`;
}
