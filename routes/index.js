/**
 * router defination file
 */

const express = require("express");
const router = express.Router();

const { getUrl, createUrl } = require("../controllers/getset");
const { getUrlMongo } = require("../controllers/helpers")
const { urlCount } = require("../controllers/admin")

router.get("*", function(req, res, next) {
  console.info(`URL: ${req.url}`);
  return next();
});

/**
 * send ok if all prerequisite are satisfied
 */
router.get("/ping", async (req, res) => {
  if (getUrlMongo("shortUrl")[0] == 500) {
    res.sendStatus(500);
  } else {
    res.sendStatus(200);
  }
});

// routes
router.post("/url/create", createUrl);
router.get("/urlCount/:fromDate/:toDate", urlCount)
router.get("/:shortUrl", getUrl);

module.exports = router;
