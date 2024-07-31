const server = Bun.serve({
  port: 3000,
  fetch(req) {
	const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response("Hello from Bun!");
    }
    if (url.pathname === "/complex") {
      // Simulate complex calculation or database query
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += i;
      }
      return new Response(`Complex calculation result: ${sum}`)
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Listening on http://localhost:${server.port}`);