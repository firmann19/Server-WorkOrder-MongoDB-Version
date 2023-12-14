const express = require("express");
const {
  AllWorkOrder,
  AllDepartement,
  AllGroup,
  AllUser,
  AllOnProgress,
  AllClose,
  AllITPerformance,
} = require("./controller");
const router = express();

router.get("/allworkorder", AllWorkOrder);
router.get("/alldepartement", AllDepartement);
router.get("/allgroup", AllGroup);
router.get("/alluser", AllUser);
router.get("/allonprogress", AllOnProgress);
router.get("/allclose", AllClose);
router.get("/allitperformance", AllITPerformance);

module.exports = router;
