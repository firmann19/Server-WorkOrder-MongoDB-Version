const express = require("express");
const {
  create,
  index,
  getOne,
  update,
  destroy,
  StatusWO,
  StatusPengerjaan,
  StatusProgress,
  getCheckoutIdUser,
  getCheckoutDepartementUser,
} = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");
const router = express();

router.post(
  "/checkout",
  authenticateUser,
  authorizeRoles("User", "Staff IT", "Manager IT"),
  create
);
router.get(
  "/checkout",
  authenticateUser,
  authorizeRoles("User", "Staff IT", "Manager IT"),
  index
);
router.get(
  "/checkoutbyiduser",
  authenticateUser,
  //authorizeRoles("User", "Staff IT", "Manager IT"),
  getCheckoutIdUser
);
router.get(
  "/checkoutbydepartementuser",
  authenticateUser,
  //authorizeRoles("User", "Staff IT", "Manager IT"),
  getCheckoutDepartementUser
);
router.get(
  "/checkout/:id",
  authenticateUser,
  authorizeRoles("User", "Staff IT", "Manager IT"),
  getOne
);
router.put(
  "/checkout/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  update
);
router.delete("/checkout/:id", authenticateUser, destroy);
router.put(
  "/checkout/:id/statuswo",
  authenticateUser,
  authorizeRoles("User"),
  StatusWO
);
router.put(
  "/checkout/:id/statuspengerjaan",
  authenticateUser,
  StatusPengerjaan,
  authorizeRoles("Staff IT", "Manager IT")
);
router.put(
  "/checkout/:id/statusprogress",
  authenticateUser,
  authorizeRoles("Manager IT"),
  StatusProgress
);

module.exports = router;
