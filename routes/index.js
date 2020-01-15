/**
 * router defination file
 */

const express = require("express");
const router = express.Router();

const { getUrl, createUrl } = require("../controllers/getset");
const { urlCount } = require("../controllers/admin")

router.get("*", function(req, res, next) {
  console.info(`URL: ${req.url}`);
  return next();
});

/**
 * send ok if all prerequisite are satisfied
 */
router.get("/ping", async (req, res) => {
  if (findCategory()[0] != null) {
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }
});

router.post("/url/create", createUrl);
router.get("/urlCount/:fromDate/:toDate", urlCount)
router.get("/*", getUrl);

module.exports = router;
