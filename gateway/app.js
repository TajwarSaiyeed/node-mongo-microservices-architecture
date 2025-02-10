const express = require("express");
const expressProxy = require("express-http-proxy");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.use("/api/user", expressProxy("http://localhost:3001"));
app.use("/api/captain", expressProxy("http://localhost:3002"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
