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
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get(
  "/user",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  index
);
router.get("/userApprove", authenticateUser, indexApprove);
router.get(
  "/user/:id",
  authenticateUser,
  authorizeRoles("User", "Staff IT", "Manager IT"),
  getOne
);
router.put(
  "/user/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  update
);
router.delete(
  "/user/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);

module.exports = router;
