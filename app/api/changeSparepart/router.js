const express = require("express");
const {
  create,
  index,
  getOne,
  destroy,
  ApproveStatus,
  RejectStatus
} = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");
const router = express();

router.post(
  "/changeSparepart/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  create
);
router.get(
  "/changeSparepart",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  index
);
router.get(
  "/changeSparepart/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  getOne
);
router.delete(
  "/changeSparepart/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);
router.put(
  "/changeSparepart/:id/approveStatusPengajuan",
  authenticateUser,
  authorizeRoles("Manager IT"),
  ApproveStatus
);
router.put(
  "/changeSparepart/:id/rejectStatusPengajuan",
  authenticateUser,
  authorizeRoles("Manager IT"),
  RejectStatus
);

module.exports = router;
