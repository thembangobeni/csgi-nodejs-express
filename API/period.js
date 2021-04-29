const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { check, oneOf } = require('express-validator');
const { now } = require('lodash');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 
const dateNowFormat = date.format(dateNow, 'DD-MM-YYYY');
const dateNowHHMM   = date.format(dateNow, 'hh:mm'); 

/**
 * get all Periods Admin
 * @function getAllPeriods function name
 * @param req receive request as input
 * @param res send response back to calling function
 */

async function getAllPeriods(req, res) {
    console.log('getAllPeriods: Start')
    try {
        const allAllPeriods = await prisma.csgi_period.findMany()

        res.send(allAllPeriods);
        console.log('getAllPeriods: success')
    } catch (err) {
        console.log('getAllPeriods error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * select single Period
 * @function getSinglePeriod function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSinglePeriod(req, res) {
    let periodid = req.params.id
    var csgi_period = {}
    console.log('getSinglePeriod: Start')

    try {
        // Get one Csgi_user
        if (check(periodid).notEmpty()) {
            csgi_period = await prisma.csgi_period.findUnique({
                where: {
                    periodid: parseInt(periodid),
                }
            })
            
            res.send(JSON.stringify(csgi_period));
        }else {
            console.log('Period is Empty: ', periodid);
            res.send({ "status": 302, "error":  'Missing input identifier', "response": null });
            return;
        }

        console.log('getSinglePeriod: End')
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

/**
 * Create/Capture Period
 * @function addNewPeriod function name
 * @param req receive request as input
 * @param res send response back to calling function
 * @Query (Period_name, last-name,date_of_birth) unique combination to identify already existing Period
 */
async function addNewPeriod(req, res) {
    const { periodname, period_desc, period_date, period_start, period_end, created_by } = req.body

    //declare local variables and initialise
    let lv_username   = req.body.username  // get from session to do
    let lv_pdate      = date.format(period_date, 'DD-MM-YYYY'); 
    let lv_pstarttime = date.format(period_start, 'hh:mm'); 
    let lv_pendtime   = date.format(period_end, 'hh:mm'); 

    try {
        console.log('addNewPeriod: ', dateNow);
        const csgi_period = await prisma.csgi_period.findFirst({
            where: {
                periodname: periodname,
                period_date: lv_pdate,
                period_start: lv_pstarttime,
                period_end: lv_pendtime,
            }
        })

        console.log('Period: ', csgi_period);
        console.log('Period Name: ', periodname, ' Period: ', period_desc);
        if (csgi_Period) {
            res.send(JSON.stringify({ "status": 302, "error": 'Period details already exists' }));
            return;
        }

        try {
            console.log('Period register Start: ', dateNow);
            const periodCreate = await prisma.csgi_period.createMany({
                data: [{
                    periodname: periodname, 
                    period_desc: period_desc,
                    period_date: lv_pdate, 
                    period_start: lv_pstarttime, 
                    period_end: lv_pendtime, 
                    created_by: created_by,
                },
                ],
                skipDuplicates: true,
            })
            console.log('Period creation successful Periodid: ', periodCreate.periodid);
            res.send(JSON.stringify(periodCreate));
        }
        catch (err) {
            console.log('addNewPeriod error:', err)
            res.send(JSON.stringify({ "status": 500, "error": ' registering Period ' + err, "response": null }));
        }
    }
    catch (err) {
        console.log('addNewPeriod error:', err)
        res.send(JSON.stringify({ "status": 500, "error": 'In Period ' + err, "response": null }));
    }
}

/**
 * Update one or many Period
 * @function updatePeriod function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updatePeriod(req, res) {
    const { periodname, period_desc, period_date, period_start, period_end, updated_by } = req.body
    let periodid = req.params.id
    var post_period = {}
    var lv_updatedby = updated_by //req.body.username
    let lv_pdate      = date.format(period_date, 'DD-MM-YYYY'); 
    let lv_pstarttime = date.format(period_start, 'hh:mm'); 
    let lv_pendtime   = date.format(period_end, 'hh:mm'); 

    try {
        if (check(periodid).notEmpty()) {
            post_period = await prisma.csgi_period.updateMany({
                where: { periodid: parseInt(periodid), },
                data: {
                    periodname: periodname, 
                    period_desc: period_desc, 
                    period_date:lv_pdate,
                    period_start: lv_pstarttime, 
                    period_end: lv_pendtime, 
                    updated_date: dateNow,
                    updated_by: lv_updatedby,
                },
            })
                 //res.json(post_user)
        console.log('User update successful periodId: ', periodid);
        res.send(JSON.stringify(post_period));
        } else {
                console.log('Period is Empty: ', periodid);
                res.send(JSON.stringify({ "status": 302, "error":  'Missing input identifier', "response": null }));
                return;
            }
    }
    catch (err) {
        console.log('updatePeriod error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * Delete user take caution when using this
 * @function updatePeriod function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deletePeriod(req, res) {
    let periodid = req.params.id
    var del_period = {}

    try {
        // delete one Csgi_user based on unique email
        if (check(periodid).notEmpty()) {
            del_period = await prisma.csgi_period.deleteMany({
                where: {
                    Periodid: parseInt(periodid),
                }
            })

            console.log('Period deleted successful Periodid: ', periodid);
            res.send(JSON.stringify({ "response": 'Period delete success' }));
        } else {
                console.log('Period periodid is Empty: ', periodid);
                res.send(JSON.stringify({ "status": 302, "error":  'Missing input identifier', "response": null }));
                return;
        }
    }
    catch (err) {
        console.log('deletePeriod error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

// Export module
module.exports = {
    getAllPeriods,
    getSinglePeriod,
    addNewPeriod,
    updatePeriod,
    deletePeriod
}