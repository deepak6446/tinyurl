const { wait } = require("../utils")
const urlMeta = require("../models/urlMeta");
const {
    OK,
    mongoError,
    datesRequired
} = require('../message');

/**
 * 
 * @param {*} req: request object
 * @param {*} res: response object
 * 
 * get number of urls created in a specified date range
 * @format req.params.fromDate: yyyy-mm-dd
 * @format req.params.toDate: yyyy-mm-dd
 */
const urlCount = async (req, res) => {
    console.log("param",req.param)
    let fromDate = req.params.fromDate
    let toDate = req.params.toDate

    if(!fromDate || !toDate) {

    }

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
    if(err) {
        return res.status(mongoError.status).send(mongoError.response)
    }
    return res.status(OK.status).send({count:count})
}

module.exports = {
    urlCount
}