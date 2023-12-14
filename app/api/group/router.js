const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");


router.post("/group", create);
router.get("/group", index);
router.get("/group/:id", getOne);
router.put("/group/:id", update);
router.delete("/group/:id", destroy);

module.exports = router;
