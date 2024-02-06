const { Server } = require("https");
const fs = require("fs");
const next = require("next");
const { parse } = require("url");

const port = parseInt(process.env.APPS_PORT) || 443; // 3000
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();
const httpsOptions = {
  key: fs.readFileSync("./certificates/localhost.key"),
  cert: fs.readFileSync("./certificates/localhost.crt"),
};
app
  .prepare()
  .then(() => {
    // create http server
    const httpsServer = new Server(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handler(req, res, parsedUrl);
    });

    // start listening
    httpsServer.listen(port, () => {
      console.log("> ready on " + process.env.APPS_DOMAIN + ":" + port);
      console.log("> environment: " + process.env.APPS_ENVIRONMENT);
      // console.log(process.env);
    });
  })
  .catch((err) => {
    console.error("Next.js server failed to start", err);
  });
