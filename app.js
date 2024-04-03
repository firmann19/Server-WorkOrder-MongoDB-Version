var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

var app = express();

// Import router
const departementRouter = require("./app/api/departement/router");
const groupRouter = require("./app/api/group/router");
const posisiRouter = require("./app/api/posisi/router");
const roleRouter = require("./app/api/role/router");
const userRouter = require("./app/api/user/router");
const checkoutRouter = require("./app/api/checkoutWO/router");
const changeSparepartRouter = require("./app/api/changeSparepart/router");
const dashboardRouter = require("./app/api/dashboard/router");
const imagesRouter = require("./app/api/images/router");

// middlewares
const notFoundMiddleware = require("./app/middlewares/not-found");
const handleErrorMiddleware = require("./app/middlewares/handler-error");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to api WorkOrder",
  }); 
});

// gunakan router
app.use(departementRouter);
app.use(groupRouter);
app.use(posisiRouter);
app.use(roleRouter);
app.use(userRouter);
app.use(checkoutRouter);
app.use(changeSparepartRouter);
app.use(dashboardRouter);
app.use(imagesRouter);

// middlewares
app.use(notFoundMiddleware);
app.use(handleErrorMiddleware);

module.exports = app;
