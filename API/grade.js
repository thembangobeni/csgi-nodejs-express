const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const { check, oneOf } = require('express-validator');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 

/**
 * get all grades
 * @function getAllGrades function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getAllGrades(req, res) {
    console.log('getAllGrades: Start')
    try {
        const allgrades = await prisma.csgi_grade.findMany()

        res.send(JSON.stringify({ "status": 200, "error": null, "response": allgrades }));
        console.log('getAllgrades: success')
    }
    catch (err) {
        console.log('getAllgrades error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * select single grade
 * @function getSingleGrade function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleGrade(req, res) {
    let gradeid = req.params.id
    var csgi_grade = {}
    console.log('getSinglegrade: Start')

    try {
        // Get one Csgi_grade
        if (check(gradeid).notEmpty()) {
            csgi_grade = await prisma.csgi_grade.findUnique({
                where: {
                    gradeid: parseInt(gradeid),
                }
            })
        }

        res.send(JSON.stringify({ "status": 200, "error": null, "response": csgi_grade }));
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

/**
 * Create/Capture grade
 * @function addNewGrade function name
 * @param req receive request as input
 * @param res send response back to calling function
 * @Query (gradecode) unique to identify already existing classgrade
 */
async function addNewGrade(req, res) {
    const { gradecode, grade, created_by, updated_date, updated_by } = req.body
    let lv_username = req.body.username  // get from session to do 
    //let lv_Date          = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        console.log('addNewgrade: ', dateNow);
        const csgi_grade = await prisma.csgi_grade.findFirst({
            where: {
                gradecode: gradecode,
            }
        })

        console.log('grade: ', csgi_grade);
        console.log('grade: ', gradecode, ' grade: ', grade);
        if (csgi_grade) {
            res.send(JSON.stringify({ "status": 302, "error": 'grade details already exists' }));
            return;
        }

        try {
            console.log('Grade register Start: ', dateNow);
            const gradeCreate = await prisma.csgi_grade.createMany({
                data: [{
                    gradecode: gradecode,
                    grade: grade,
                    created_by: created_by,
                },
                ],
                skipDuplicates: true,
            })
            console.log('grade creation successful gradeid: ', gradeCreate.gradeid);
            res.send(JSON.stringify({ "status": 200, "error": null, "response": gradeCreate }));
        }
        catch (err) {
            res.send(JSON.stringify({ "status": 500, "error": ' registering grade ' + err, "response": null }));
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": 'In grade ' + err, "response": null }));
    }
}

/**
 * Update one or many grade
 * @function updateGrade function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updateGrade(req, res) {
    const { gradecode, grade, created_by, updated_date, updated_by } = req.body
    let gradeid = req.params.id
    var post_grade = {}
    var lv_updatedby = updated_by //req.body.username
  //  let lv_DoB = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        if (check(gradeid).notEmpty()) {
            post_grade = await prisma.csgi_grade.updateMany({
                where: { gradeid: parseInt(gradeid), },
                data: {
                    gradecode: gradecode,
                    grade: grade,
                    updated_date: dateNow,
                    updated_by: updated_by,
                },
            })

        console.log('grade update successful gradeId: ', gradeid);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": post_grade }));
        } else{
            res.send(JSON.stringify({ "status": 302, "error": 'Missing identifier' }));
            return;
        }
    }
    catch (err) {
        console.log('updategrade error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * Delete user take caution when using this
 * @function deleteGrade function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deleteGrade(req, res) {
    let gradeid = req.params.id
    var del_grade = {}

    try {
        // delete one Csgi_user based on unique email
        if (check(gradeid).notEmpty()) {
            del_grade = await prisma.csgi_grade.deleteMany({
                where: {
                    gradeid: parseInt(gradeid),
                }
            })

        console.log('Grade deleted successful gradeid: ', gradeid);
        res.send(JSON.stringify({ "status": 200, "error": null, "response": 'Grade delete success' }));
        } else{
            res.send(JSON.stringify({ "status": 302, "error": 'Missing identifier' }));
            return;
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

// Export module
module.exports = {
    getAllGrades,
    getSingleGrade,
    addNewGrade,
    updateGrade,
    deleteGrade
}