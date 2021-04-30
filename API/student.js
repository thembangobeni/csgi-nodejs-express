const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { check, oneOf } = require('express-validator');
const { now } = require('lodash');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 


/**
 * get all Students Admin
 * @function getAllStudents function name
 * @param req receive request as input
 * @param res send response back to calling function
 */

async function getAllStudents(req, res) {
    console.log('getAllStudents: Start')
    try {
        const allAllStudents = await prisma.csgi_student.findMany()

      // res.send(JSON.stringify({ "status": 200, "error": null, "response": allAllStudents }));
       res.send(JSON.stringify(allAllStudents));
       // console.log('getAllStudents: success',JSON.stringify(allAllStudents));
    } catch (err) {
        console.log('getAllStudents error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * select single Student
 * @function getSingleStudent function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleStudent(req, res) {
    let studentid = req.params.id
    var csgi_student = {}
    console.log('getSingleStudent: Start')

    try {
        // Get one Csgi_user
        if (check(studentid).notEmpty()) {
            csgi_student = await prisma.csgi_student.findMany({
                where: {
                    studentid: parseInt(studentid),
                }
            })
        console.log('Student studentid founf: ', studentid);
        res.send(JSON.stringify(csgi_student));
        } else {
            console.log('Student studentid is Empty: ', studentid);
            res.send(JSON.stringify({ "status": 302, "error": 'Missing input identifier', "response": null }));
            return;
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

/**
 * Create/Capture Student
 * @function addNewStudent function name
 * @param req receive request as input
 * @param res send response back to calling function
 * @Query (student_name, last-name,date_of_birth) unique combination to identify already existing student
 */
async function addNewStudent(req, res) {
    const { student_name, last_name, date_of_birth, gender, created_by, updated_date, updated_by } = req.body
    let lv_username = req.body.username  // get from session to do 
    let lv_DoB = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        console.log('addNewStudent: ', lv_DoB);
        const csgi_student = await prisma.csgi_student.findFirst({
            where: {
                student_name: student_name,
                last_name: last_name,
                date_of_birth: lv_DoB,
            }
        })

        console.log('Student: ', csgi_student);
        console.log('Student: ', student_name, ' Last_name: ', last_name, 'date_of_birth: ', lv_DoB);
        if (csgi_student) {
            res.send(JSON.stringify({ "status": 302, "error": 'Student details already exists' }));
            return;
        }

        try {
            console.log('Student register Start: ', dateNow);
            const studentCreate = await prisma.csgi_student.createMany({
                data: [{
                    student_name: student_name,
                    last_name: last_name,
                    date_of_birth: lv_DoB,
                    gender: gender,
                    created_by: created_by,
                },
                ],
                skipDuplicates: true,
            })
            console.log('Student creation successful Studentid: ', studentCreate.studentid);
            res.send(JSON.stringify({ "response": 'User register successful' }));
        }
        catch (err) {
            res.send(JSON.stringify({ "status": 500, "error": ' registering student ' + err, "response": null }));
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": 'In student ' + err, "response": null }));
    }
}

/**
 * Update one or many student
 * @function updateStudent function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updateStudent(req, res) {
    const { student_name, last_name, date_of_birth, gender, updated_date, updated_by } = req.body
    let studentid = req.params.id
    var post_student = {}
    var lv_updatedby = updated_by //req.body.username
    let lv_DoB = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        if (check(studentid).notEmpty()) {
            post_student = await prisma.csgi_student.updateMany({
                where: { studentid: parseInt(studentid), },
                data: {
                    student_name: student_name,
                    last_name: last_name,
                    date_of_birth: lv_DoB,
                    gender: gender,
                    updated_date: dateNow,
                    updated_by: lv_updatedby,
                },
            })

        console.log('User update successful StudentId: ', studentid);
        res.send(JSON.stringify(post_student));
        }else {
            console.log('Student studentid is Empty: ', studentid);
            res.send(JSON.stringify({ "status": 302, "error": 'Missing input identifier', "response": null }));
            return;
        }


    }
    catch (err) {
        console.log('updateStudent error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * Delete user take caution when using this
 * @function updateStudent function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deleteStudent(req, res) {
    let studentid = req.params.id
    var del_student = {}

    try {
        // delete one Csgi_user based on unique email
        if (check(studentid).notEmpty()) {
            del_student = await prisma.csgi_student.deleteMany({
                where: {
                    studentid: parseInt(studentid),
                }
            })

            console.log('Student deleted successful studentid: ', studentid);
            res.send(JSON.stringify({"response": 'student delete success' }));
        } else {
            console.log('Student studentid is Empty: ', studentid);
            res.send(JSON.stringify({ "status": 302, "error": 'Missing input identifier', "response": null }));
            return;
        }

    
     
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

// Export module
module.exports = {
    getAllStudents,
    getSingleStudent,
    addNewStudent,
    updateStudent,
    deleteStudent
}
