const express = require("express");
const router = express();
const { create, update, index, getOne, destroy } = require("./controller");


router.post("/departement", create);
router.get("/departement", index);
router.get("/departement/:id", getOne);
router.put("/departement/:id", update);
router.delete("/departement/:id", destroy);

module.exports = router;
