const express = require("express");
const {
  AllWorkOrder,
  AllDepartement,
  AllGroup,
  AllUser,
  AllOnProgress,
  AllClose,
} = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");
const router = express();

router.get(
  "/allworkorder",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  AllWorkOrder
);
router.get(
  "/alldepartement",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  AllDepartement
);
router.get(
  "/allgroup",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  AllGroup
);
router.get(
  "/alluser",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  AllUser
);
router.get(
  "/allonprogress",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  AllOnProgress
);
router.get(
  "/allclose",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  AllClose
);

module.exports = router;
