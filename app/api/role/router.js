const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");

router.post(
  "/role",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  create
);
router.get(
  "/role",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  index
);
router.get(
  "/role/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  getOne
);
router.put(
  "/role/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  update
);
router.delete(
  "/role/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);

module.exports = router;
