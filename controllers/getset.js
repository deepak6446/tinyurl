/**
 * contains all code related to add, update categories
 * follow swagger file for api definations
 */

const {
  OK,
  urlRequired, 
  internalErr,
  shortUrlRequired
} = require("../message");
const {
  storeInMongoDB,
  getUrlMongo,
  encoderUrl
} = require("./helpers")

/**
 * @param {*} req: request object
 * @param {*} res: responce object
 *
 * store url in db and return short url
 */
const createUrl = async (req, res) => {
  
  const { url } = req.body;
  
  if (!url || !url.trim().length) {
    return res.status(urlRequired.status).send(urlRequired.response);
  }

  let index = 0
  let [shortUrl, mongoErr] = ['', false]
  let hash = encoderUrl(url)
  console.log("------>>>>> out", shortUrl, "mongoErr:", mongoErr)

  // To handle dublicate part of hash key
  for(let index=0; (24-index-global.shortUrlLength)>=0; index++){
    let hashtrim = hash.slice(index, index+global.shortUrlLength)
    console.log('____>', hashtrim, "hash: ", hash, global.shortUrlLength)
    let x = await storeInMongoDB(hashtrim, url)
    //  = 
    console.log("------>>>>> in", x[0].length, "mongoErr:", x[1], typeof x[1])
    if(x[0].length){
      console.log("break------")
      return res.status(OK.status).send({shortUrl: x[0]})
    }else if(x[1]) {
      console.log("break------")
      return res.status(mongoError.status).send(mongoError.response)

    }
  }
  return res.status(internalErr.status).send(internalErr.response)
};

/**
 * @param {*} req: request object
 * @param {*} res: responce object
 *
 * get url from DB
 */
const getUrl = async (req, res) => {
  let shortUrl = req.path.slice(1)
  console.info("getting long url for", shortUrl)

  if (!shortUrl || !shortUrl.trim().length) {
    return res.status(shortUrlRequired.status).send(shortUrlRequired.response);
  }
  const [status, body, data] = await getUrlMongo(shortUrl)
  if (data) {
    return res.status(200).send(data);
  } else {
    return res.status(status).send(body);
  }
}

module.exports = {
  getUrl,
  createUrl
};
