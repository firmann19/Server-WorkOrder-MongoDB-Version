const express = require("express");
const {
  create,
  index,
  getOne,
  update,
  destroy,
  changeStatus,
} = require("./controller");
const { authenticateUser, authorizeRoles } = require("../../middlewares/auth");
const router = express();

router.post(
  "/changeSparepart",
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
router.put(
  "/changeSparepart/:id",
  authenticateUser,
  update
);
router.delete(
  "/changeSparepart/:id",
  authenticateUser,
  authorizeRoles("Staff IT", "Manager IT"),
  destroy
);
router.put(
  "/changeSparepart/:id/statusPengajuan",
  authenticateUser,
  changeStatus,
  authorizeRoles("Manager IT")
);

module.exports = router;
