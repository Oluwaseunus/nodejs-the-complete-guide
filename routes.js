const fs = require("fs");

function requestHandler(req, res) {
  const { url, method } = req;

  switch (url) {
    case "/":
      res.write(`
        <html>
          <body>
            <h1>Hello World</h1>

            <form action="/message" method="POST">
              <input name="username" />
              <button>Submit</button>
            </form>
          </body>
        </html>
      `);
      res.end();
      break;

    case "/users":
      res.write(`<html>
          <head>
            <title>Users</title>
          </head>
          <body>
            <h1>Users</h1>

            <ul>
              <li>User One</li>
              <li>User Two</li>
            </ul>
          </body>
        </html>
      `);
      res.end();
      break;

    case "/message":
      if (method !== "POST") break;

      const chunks = [];
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      req.on("end", () => {
        const buffer = Buffer.concat(chunks).toString();
        const username = buffer.split("=")[1];

        fs.writeFileSync("message.txt", username);
      });
      res.statusCode = 302;
      res.setHeader("Location", "/");
      res.end();
      break;

    default:
      break;
  }
}

module.exports = {
  requestHandler,
};
