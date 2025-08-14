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

    if (isAASAPath) {
      const paths = [
        "/join", "/join/*",          // allow deep link handoff here
        "/join-test", "/join-test/*" // optional
      ];
      const body = JSON.stringify({
        applinks: {
          apps: [],
          details: [{ appID: "KZH5U4Z5U3.com.battlebets.battlebets", paths }],
        },
      });
      return new Response(body, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=3600",
        },
      });
    }

    // HTML redirect page when app isn't installed
    if (isAASAHost && pathname.startsWith("/join")) {
      const APP_STORE = "https://apps.apple.com/us/app/battle-bets/id6738606749";
      const SITE_FALLBACK = "https://battlebets.app";

      const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Opening Battle Bets…</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0b1420;color:#fff;margin:0;min-height:100dvh;display:grid;place-items:center}
    .card{max-width:560px;padding:24px;background:#132235;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.25);text-align:center}
    a{color:#3bd17f}
    .muted{opacity:.85;font-size:14px}
  </style>
</head>
<body>
  <div class="card">
    <h1>Opening Battle Bets…</h1>
    <p class="muted">If the App Store doesn’t open automatically, <a id="storeLink" href="#">tap here</a> or <a id="siteLink" href="#">visit our website</a>.</p>
  </div>
  <script>
    (function () {
      var APP_STORE = ${JSON.stringify(APP_STORE)};
      var SITE_FALLBACK = ${JSON.stringify(SITE_FALLBACK)};

      // Auto-forward to App Store
      var t = Date.now();
      location.href = APP_STORE;

      // Fallback if still visible after ~1.2s
      setTimeout(function () {
        if (!document.hidden && Date.now() - t > 1100) {
          location.href = SITE_FALLBACK;
        }
      }, 1200);

      // Manual links
      document.getElementById('storeLink').href = APP_STORE;
      document.getElementById('siteLink').href = SITE_FALLBACK;
    })();
  </script>
</body>
</html>`;

      return new Response(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    // Default 404 for any other path
    return new Response(
      "You must download the Battle Bets app first. Go back, download the app, and try again.",
      { status: 404 }
    );
  },
};
