export default {
  async fetch(request) {
    const { hostname, pathname } = new URL(request.url);

    const isAASAHost = hostname === "aasa.battlebets.app";
    const isAASAPath =
      pathname === "/.well-known/apple-app-site-association" ||
      pathname === "/apple-app-site-association";

    if (!isAASAPath) return new Response("Not found", { status: 404 });

    const paths = isAASAHost
      ? [
          "/join", "/join/*",           // allow deep link handoff here
          "/join-test", "/join-test/*"  // optional
        ]
      : [
          "NOT /join", "NOT /join/*",   // force browser on join.battlebets.app
          "/join-test", "/join-test/*"  // optional
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
}