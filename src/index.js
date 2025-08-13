/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
  async fetch(request) {
    const url = new URL(request.url)
    const p = url.pathname

    // match both /.well-known/apple-app-site-association
    // and /apple-app-site-association (no leading folder)
    if (
      p === "/.well-known/apple-app-site-association" ||
      p === "/apple-app-site-association"
    ) {
      const body = JSON.stringify({
        applinks: {
          apps: [],
          details: [
            {
              appID: "KZH5U4Z5U3.com.battlebets.battlebets",
              paths: ["/join", "/join/*", "/join-test/*", "/join-test"],
            },
          ],
        },
      })

      return new Response(body, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=3600",
        },
      })
    }

    return new Response("Not found", { status: 404 })
  },
}