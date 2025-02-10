const http = require("http");
const app = require("./app");

const server = http.createServer(app);

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`Captain.Service is running on http://localhost:${PORT}`);
});
