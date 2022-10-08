require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT;

// for parsing json
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

const route = require("./app/routes");
app.use(route);
app.use("/assets", express.static("app/assets"));

app.listen(port, () => {
  console.log(
    `Server listening in ${
      process.env.ENV
    } mode to the port ${port} ${new Date()}`
  );
});
app.timeout = 320000;
