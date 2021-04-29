const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const { check, oneOf } = require('express-validator');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 


/**
 * get all Rosters Admin
 * @function getAllRosters function name
 * @param req receive request as input
 * @param res send response back to calling function
 */

async function getAllRosters(req, res) {
    console.log('getAllRosters: Start')
    try {
        const allRosters = await prisma.csgi_roster.findMany()

        res.send(JSON.stringify(allRosters));
        console.log('getAllRosters: success')
    } catch (err) {
        console.log('getAllRosters error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * select single Roster
 * @function getSingleRoster function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleRoster(req, res) {
    let rosterid = req.params.id
    var csgi_roster = {}
    console.log('getSingleRoster: Start')

    try {
        // Get one Csgi_user
        if (check(rosterid).notEmpty()) {
            csgi_roster = await prisma.csgi_roster.findUnique({
                where: {
                    rosterid: parseInt(rosterid),
                }
            })


            //res.json(csgi_roster)
            res.send(JSON.stringify(csgi_roster));
        } else {
            console.log('Roster rosterid is Empty: ', rosterid);
            res.send(JSON.stringify({ "status": 302, "error": 'Missing input identifier', "response": null }));
            return;
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

/**
 * Create/Capture Roster
 * @function addNewRoster function name
 * @param req receive request as input
 * @param res send response back to calling function
 * @Query (Roster_name, last-name,date_of_birth) unique combination to identify already existing Roster
 */
async function addNewRoster(req, res) {

    const { rosterid, classid, periodid, studentid, attended_yn, created_by } = req.body

    let lv_username = req.body.username  // get from session to do 
    //let lv_DoB = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        console.log('addNewRoster: ', dateNow);
        const csgi_roster = await prisma.csgi_roster.findFirst({
            where: {
                classid: classid,
                periodid: periodid,
                studentid: studentid,
            }
        })

        console.log('Roster: ', csgi_roster);
        console.log('Roster Name: ', Rostername, ' Roster: ', roster_desc);
        if (csgi_roster) {
            res.send(JSON.stringify({ "status": 302, "error": 'Roster details already exists' }));
            return;
        }

        try {
            console.log('Roster register Start: ', dateNow);
            const rosterCreate = await prisma.csgi_roster.createMany({
                data: [{
                    rosterid: rosterid,
                    classid: classid,
                    periodid: periodid,
                    studentid: studentid,
                    attended_yn: attended_yn,
                    created_by: created_by,
                },
                ],
                skipDuplicates: true,
            })
            console.log('Roster creation successful Rosterid: ', rosterCreate.rosterid);
            res.send(JSON.stringify(rosterCreate));
        }
        catch (err) {
            res.send(JSON.stringify({ "status": 500, "error": ' registering Roster ' + err, "response": null }));
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": 'In Roster ' + err, "response": null }));
    }
}

/**
 * Update one or many Roster
 * @function updateRoster function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updateRoster(req, res) {
    const { classid, periodid, studentid, attended_yn, updated_by } = req.body
    let rosterid = req.params.id
    var post_roster = {}
    var lv_updatedby = updated_by //req.body.username

    try {
        if (check(rosterid).notEmpty()) {
            post_roster = await prisma.csgi_roster.updateMany({
                where: { rosterid: parseInt(rosterid), },
                data: {
                    classid: classid,
                    periodid: periodid,
                    studentid: studentid,
                    attended_yn: attended_yn,
                    updated_date: dateNow,
                    updated_by: lv_updatedby,
                },
            })

            console.log('User update successful RosterId: ', rosterid);
            res.send(JSON.stringify(post_roster));
        } else {
            console.log('Roster rosterid is Empty: ', rosterid);
            res.send(JSON.stringify({ "status": 302, "error": 'Missing input identifier', "response": null }));
            return;
        }
    }
    catch (err) {
        console.log('updateRoster error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * Delete user take caution when using this
 * @function updateRoster function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deleteRoster(req, res) {
    let rosterid = req.params.id
    var del_roster = {}

    try {
        // delete one Csgi_user based on unique email
        if (check(rosterid).notEmpty()) {
            del_roster = await prisma.csgi_roster.deleteMany({
                where: {
                    rosterid: parseInt(rosterid),
                }
            })

            console.log('Roster deleted successful Rosterid: ', rosterid);
            res.send(JSON.stringify({ "response": 'Roster delete success' }));
        } else {
            console.log('Roster rosterid is Empty: ', rosterid);
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
    getAllRosters,
    getSingleRoster,
    addNewRoster,
    updateRoster,
    deleteRoster
}