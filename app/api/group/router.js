const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");

router.post(
  "/group",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  create
);
router.get(
  "/group",
  authenticateUser,
  authorizeRoles("Manager IT", "Staff IT"),
  index
);
router.get(
  "/group/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  getOne
);
router.put(
  "/group/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  update
);
router.delete(
  "/group/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);

module.exports = router;
