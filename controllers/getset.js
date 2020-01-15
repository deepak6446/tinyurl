/**
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
 * @requied req.body.url
 * 
 * create hash of url, let first 7 char as shortUrl
 * check in db if short url is already present
 * if yes consider next 7 char as short url and continue 
 * if no store url in db and return short url
 */
const createUrl = async (req, res) => {
  
  const { url } = req.body;
  
  if (!url || !url.trim().length) {
    return res.status(urlRequired.status).send(urlRequired.response);
  }

  let hash = encoderUrl(url)

  // To handle dublicate part of hash key
  let shortUrlLength = parseInt(process.env.shortUrlLength)
  for(let index=0; (24-index-shortUrlLength)>=0; index++){
    let hashtrim = hash.slice(index, index+shortUrlLength)
    let x = await storeInMongoDB(hashtrim, url)
    if(x[0].length){
      return res.status(OK.status).send({shortUrl: x[0]})
    }else if(x[1]) {
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
  let shortUrl = req.params.shortUrl
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
