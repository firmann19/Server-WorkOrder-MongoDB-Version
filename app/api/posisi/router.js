const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");

router.post(
  "/posisi",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  create
);
router.get(
  "/posisi",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  index
);
router.get(
  "/posisi/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  getOne
);
router.put(
  "/posisi/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  update
);
router.delete(
  "/posisi/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);

module.exports = router;
