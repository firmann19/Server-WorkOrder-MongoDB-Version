const express = require("express");
const {
  create,
  index,
  getOne,
  update,
  destroy,
  changeStatus,
} = require("./controller");
const router = express();

router.post("/changeSparepart", create);
router.get("/changeSparepart", index);
router.get("/changeSparepart/:id", getOne);
router.put("/changeSparepart/:id", update);
router.delete("/changeSparepart/:id", destroy);
router.put("/changeSparepart/:id/statusPengajuan", changeStatus);

module.exports = router;
