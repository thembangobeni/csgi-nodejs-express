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

        res.send(JSON.stringify(allTeachers));
        console.log('getAllTeachers: success');
    }
    catch (err) {
        console.log('getAllTeachers error:', err);
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
        return;
    }
}

/**
 * select single teacher report
 * @function getSingleTeacher function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleTeacher(req, res) {
    let teacherid = req.params.id
    var csgi_teacher = {}
    console.log('getSingleTeacher: Start: ',teacherid)
    try {

        if (check(teacherid).isEmail().notEmpty()) {
            csgi_teacher = await prisma.csgi_teacher_v.findMany({
                where: {
                    teacherid: teacherid,
                }
            })
        }
        
        res.send(JSON.stringify(csgi_teacher)); 
    } catch (err) {
         console.log('getSingleTeacher error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         } 
}

// Export module
module.exports = {
    getAllTeachers,
    getSingleTeacher
}