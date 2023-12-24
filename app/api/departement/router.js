const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");

router.post(
  "/departement",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  create
);
router.get(
  "/departement",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  index
);
router.get(
  "/departement/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  getOne
);
router.put(
  "/departement/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  update
);
router.delete(
  "/departement/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);

module.exports = router;
