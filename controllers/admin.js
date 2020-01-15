const { wait } = require("../utils")
const urlMeta = require("../models/urlMeta");
const {
    OK,
    mongoError
} = require('../message');

const urlCount = async (req, res) => {
    console.log("param",req.param)
    let fromDate = req.params.fromDate
    let toDate = req.params.toDate
    // let { fromDate, toDate } = req.param
    toDate = new Date(toDate)
    toDate.setDate(toDate.getDate() + 1)

    console.log(fromDate, toDate)
    let findQuery = {
        created_at: {
            $gte: (new Date(fromDate)),
            $lt: toDate
        }
    }
    let [err, count] = await wait(urlMeta.count, urlMeta, findQuery);
    console.log(err, count)
    if(count){
        return res.status(OK.status).send({count:count})
    }else if(err) {
      console.log("break------")
      return res.status(mongoError.status).send(mongoError.response)
    }
}

module.exports = {
    urlCount
}