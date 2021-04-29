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
 * get all Classs Admin
 * @function getAllClasses function name
 * @param req receive request as input
 * @param res send response back to calling function
 */

async function getAllClasses(req, res) {
    console.log('getAllClasss: Start: ', dateNowFormat, ' Time: ', dateNowHHMM)
    try {
        const allClasses = await prisma.csgi_class.findMany()

        res.send(allClasses);
        console.log('getAllClasses: success')
        console.log('getAllClasss: End: ', dateNowFormat, ' Time: ', dateNowHHMM)
    } catch (err) {
        console.log('getAllClasss error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
        }
}

/**
 * select single Class
 * @function getSingleClass function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleClass(req, res) {
    let classid = req.params.id
    var csgi_class = {}
    console.log('getSingleClass: Start')

    try {

        if (check(classid).notEmpty()) {
            csgi_class = await prisma.csgi_class.findUnique({
                where: {
                    classid: parseInt(classid),
                }
            })

            res.send(csgi_class);
        }else {
            console.log('Class Classid is Empty: ', classid);
            res.send(JSON.stringify({ "status": 302, "error":  'Missing input identifier', "response": null }));
            return;
        }

       
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

/**
 * Create/Capture Class
 * @function addNewClass function name
 * @param req receive request as input
 * @param res send response back to calling function
 * @Query (classname) unique to identify already existing Class
 */
async function addNewClass(req, res) {
    const { classname, class_desc, userid, gradeid, roomid, created_by }  = req.body

    let lv_username = req.body.username  // get from session to do 

    try {
        console.log('addNewClass: ', dateNow);
        const csgi_class = await prisma.csgi_class.findFirst({
            where: {
                classname: classname,
            }
        })

        console.log('Class: ', csgi_class);
        console.log('Class Name: ', classname, ' Class: ', class_desc);
        if (csgi_class) {
            res.send(JSON.stringify({ "status": 302, "error": 'Class details already exists' }));
            return;
        }

        try {
            console.log('Class register Start: ', dateNow);
            const classCreate = await prisma.csgi_class.createMany({
                data: [{
                    classname:classname, 
                    class_desc:class_desc, 
                    userid:userid, 
                    gradeid:gradeid, 
                    roomid:roomid, 
                    created_by: created_by,
                },
                ],
                skipDuplicates: true,
            })
            console.log('Class creation successful classid: ', classCreate.classid);
            res.send(classCreate);
        }
        catch (err) {
            res.send(JSON.stringify({ "status": 500, "error": ' registering Class ' + err, "response": null }));
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": 'In Class ' + err, "response": null }));
    }
}

/**
 * Update one or many Class
 * @function updateClass function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updateClass(req, res) {
    const { classname, class_desc, userid, gradeid, roomid, created_by, updated_date, updated_by }  = req.body
    let classid = req.params.id
    var post_class = {}
    var lv_updatedby = updated_by //req.body.username

    try {
        if (check(classid).notEmpty()) {
            post_Class = await prisma.csgi_class.updateMany({
                where: { Classid: parseInt(classid), },
                data: {
                    classname:classname, 
                    class_desc:class_desc, 
                    userid:userid, 
                    gradeid:gradeid, 
                    roomid:roomid, 
                    updated_date: dateNow,
                    updated_by: lv_updatedby,
                },
            })

            console.log('User update successful ClassId: ', classid);
            res.send(post_class);
        } else {
                console.log('Class Classid is Empty: ', classid);
                res.send(JSON.stringify({ "status": 302, "error":  'Missing input identifier', "response": null }));
                return;
            }

        
    }
    catch (err) {
        console.log('updateClass error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * Delete user take caution when using this
 * @function deleteClass function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deleteClass(req, res) {
    let Classid = req.params.id
    var del_Class = {}

    try {
        // delete one Csgi_user based on unique email
        if (check(classid).notEmpty()) {
            del_class = await prisma.csgi_class.deleteMany({
                where: {
                    classid: parseInt(classid),
                }
            })

            console.log('Class deleted successful Classid: ', classid);
            res.send(JSON.stringify({"response": 'Class delete success' }));
        } else {
                console.log('Class Classid is Empty: ', classid);
                res.send(JSON.stringify({ "status": 302, "error":  'Missing input identifier', "response": null }));
                return;
            }
  
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

// Export module
module.exports = {
    getAllClasses,
    getSingleClass,
    addNewClass,
    updateClass,
    deleteClass
}