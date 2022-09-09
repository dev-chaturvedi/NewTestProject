const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config/config.js");
const morgan = require("morgan");
const cors = require("cors");
const db =require("./dbconnections/mongodb")
const index = require("./routes/indexRoute");
const app = express();
const path = require("path");
var expressValidator = require("express-validator");
// app.use(expressValidator())
app.use(morgan('dev'));
var api = express.Router();

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());
app.use("/api/v1", index);

app.use('/api/v1/staticPage',require('./routes/staticPageRouter'))
app.use("/", express.static(path.join(__dirname, "public")));
app.listen(global.gConfig.node_port, function() {
  console.log(" Server is listening on ", global.gConfig.node_port);
});
