const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const { check, oneOf } = require('express-validator');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 


/**
 * Display detailed report for teacher
 * @function getAllDetailReport function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
 async function getAllDetailReport(req, res) {
    var teacherid = req.params.id
    let csgi_detailreport = {}
    console.log('getAllDetailReport: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            console.log('Teacher Id: ',teacherid);
            csgi_detailreport = await prisma.csgi_detailreport_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        } else{
            console.log('Missing teacher identifier, not provided');
            res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
            return;
        }
        console.log(JSON.stringify(csgi_detailreport));
        console.log('getAllDetailReport: End')
        res.send(JSON.stringify(csgi_detailreport));
    } catch (err) {
         console.log('getAllDetailReport error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         }
}


/**
 * Display Quartely report for teacher
 * @function getAllSummaryQuarter function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
 async function getAllSummaryQuarter(req, res) {
    var teacherid = req.params.id
    const csgi_summaryreportQ = {}
    console.log('getAllSummaryQuarter: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_summaryreportQ = await prisma.csgi_summaryreport_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        }else{
                console.log('Missing teacher identifier, not provided');
                res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
                return;
            }

            res.send(JSON.stringify(csgi_summaryreportQ));
        } catch (err) {
                console.log('getAllSummaryQuarter error:', err);
                 res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
             }

 }

// Export module
module.exports = {
    getAllDetailReport,
    getAllSummaryQuarter
}