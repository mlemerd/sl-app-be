const express = require("express");
const router = express.Router();

const UpdateAbl = require("../abl/item/updateAbl");

router.post("/update", (req, res) => {
  UpdateAbl(req, res);
});

module.exports = router;