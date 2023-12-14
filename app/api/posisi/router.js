const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");


router.post("/posisi", create);
router.get("/posisi", index);
router.get("/posisi/:id", getOne);
router.put("/posisi/:id", update);
router.delete("/posisi/:id", destroy);

module.exports = router;
