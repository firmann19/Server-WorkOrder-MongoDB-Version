const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");


router.post("/role", create);
router.get("/role", index);
router.get("/role/:id", getOne);
router.put("/role/:id", update);
router.delete("/role/:id", destroy);

module.exports = router;
