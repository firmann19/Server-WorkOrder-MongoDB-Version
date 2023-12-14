const express = require("express");
const router = express();
const {
  register,
  login,
  index,
  getOne,
  update,
  destroy,
  indexApprove,
} = require("./controller");
const { authenticateUser } = require("../../middlewares/auth");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/user", index);
router.get("/userApprove", authenticateUser, indexApprove);
router.get("/user/:id", getOne);
router.put("/user/:id", update);
router.delete("/user/:id", destroy);

module.exports = router;
