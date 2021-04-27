const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const { check, oneOf } = require('express-validator');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 

/**
 * get all teachers
 * @function getAllTeachers function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getAllTeachers(req, res) {
    console.log('getAllTeachers: Start')
    try {
        const allTeachers = await prisma.csgi_teacher_v.findMany()

        res.send(JSON.stringify({ "status": 200, "error": null, "response": allTeachers }));
        console.log('getAllTeachers: success')
    }
    catch (err) {
        console.log('getAllTeachers error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
        return;
    }
}

/**
 * select single grade
 * @function getSingleTeacher function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleTeacher(req, res) {
    let teacherid = req.params.id
    var csgi_teacher = {}
    console.log('getSingleTeacher: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_teacher = await prisma.csgi_teacher_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        }else{
            if (parseInt(teacherid) && check(teacherid).notEmpty()) {
                teacherid = parseInt(id)
                csgi_teacher = await prisma.csgi_teacher_v.findUnique({
                    where: {
                        teacherid: teacherid,
                    }
                })
            }else{
                console.log('Missing teacher identifier, not provided');
                res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
                return;
            }

        }

        res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_teacher}));
    } catch (err) {
         console.log('getSingleTeacher error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         }
}

/**
 * Display detailed report for teacher
 * @function getAllDetailReport function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
 async function getAllDetailReport(req, res) {
    let teacherid = req.params.id
    var csgi_summaryreport = {}
    console.log('getAllDetailReport: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_summaryreport = await prisma.csgi_summaryreport_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        }else{
            if (parseInt(teacherid) && check(teacherid).notEmpty()) {
                teacherid = parseInt(id)
                csgi_summaryreport = await prisma.csgi_summaryreport_v.findMany({
                    where: {
                        teacherid: teacherid,
                    }
                })
            }else{
                console.log('Missing teacher identifier, not provided');
                res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
                return;
            }

        }

        res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_summaryreport}));
    } catch (err) {
         console.log('getAllDetailReport error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         }
}


/**
 * Display summary report for teacher
 * @function getAllSummaryReport function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
 async function getAllSummaryReport(req, res) {
    let teacherid = req.params.id
    var csgi_summaryreport = {}
    console.log('getAllSummaryReport: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_summaryreport = await prisma.csgi_summaryreport_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        }else{
            if (parseInt(teacherid) && check(teacherid).notEmpty()) {
                teacherid = parseInt(id)
                csgi_summaryreport = await prisma.csgi_summaryreport_v.findMany({
                    where: {
                        teacherid: teacherid,
                    }
                })
            }else{
                console.log('Missing teacher identifier, not provided');
                res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
                return;
            }

        }

        res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_summaryreport}));
    } catch (err) {
         console.log('getAllSummaryReport error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         }
}


/**
 * Display detailed report for teacher
 * @function getAllDetailReport function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
 async function getAllDetailReport(req, res) {
    let teacherid = req.params.id
    var csgi_detailreport = {}
    console.log('getAllDetailReport: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_detailreport = await prisma.csgi_detailreport_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        }else{
            if (parseInt(teacherid) && check(teacherid).notEmpty()) {
                teacherid = parseInt(id)
                csgi_detailreport = await prisma.csgi_detailreport_v.findMany({
                    where: {
                        teacherid: teacherid,
                    }
                })
            }else{
                console.log('Missing teacher identifier, not provided');
                res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
                return;
            }

        }

        res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_summaryreport}));
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
    let teacherid = req.params.id
    var csgi_summaryreport = {}
    console.log('getAllSummaryQuarter: Start')
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_detailreport = await prisma.csgi_summaryreport_v.findMany({
                where: {
                    teacheremail: teacherid,
                }
            })
        }else{
            if (parseInt(teacherid) && check(teacherid).notEmpty()) {
                teacherid = parseInt(id)
                csgi_detailreport = await prisma.csgi_summaryreport_v.findMany({
                    where: {
                        teacherid: teacherid,
                    }
                })
            }else{
                console.log('Missing teacher identifier, not provided');
                res.send(JSON.stringify({ "status": 302, "error": 'Missing teacher identifier, not provided', "response": null }));
                return;
            }

        }

        res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_summaryreport}));
    } catch (err) {
         console.log('getAllSummaryQuarter error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         }
}

// Export module
module.exports = {
    getAllTeachers,
    getSingleTeacher,
    getAllSummaryReport,
    getAllDetailReport,
    getAllSummaryQuarter
}