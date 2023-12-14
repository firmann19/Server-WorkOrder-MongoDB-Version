const express = require("express");
const { create, index, getOne, update, destroy, StatusWO, StatusPengerjaan, StatusProgress } = require("./controller");
const router = express();

router.post("/checkout", create);
router.get("/checkout", index);
router.get("/checkout/:id", getOne);
router.put("/checkout/:id", update);
router.delete("/checkout/:id", destroy);
router.put("/checkout/:id/statuswo", StatusWO);
router.put("/checkout/:id/statuspengerjaan", StatusPengerjaan);
router.put("/checkout/:id/statusprogress", StatusProgress);

module.exports = router;
