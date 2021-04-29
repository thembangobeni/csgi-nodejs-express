const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const { check, oneOf } = require('express-validator');
const date = require('date-and-time');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB
const dateNow = new Date();       // instatiate date 

/**
 * get all physical class Rooms
 * @function getAllRooms function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getAllRooms(req, res) {
    console.log('getAllRooms: Start')
    try {
        const allRooms = await prisma.csgi_room.findMany()

        res.send(JSON.stringify(allRooms));
        console.log('getAllRooms: success')
    } catch (err) {
        console.log('getAllRooms error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
        }
}

/**
 * select single room
 * @function getSingleRoom function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleRoom(req, res) {
    let roomid = req.params.id
    var csgi_room = {}
    console.log('getSingleRoom: Start')

    try {
        // Get one Csgi_room
        if (check(roomid).notEmpty()) {
            csgi_room = await prisma.csgi_room.findUnique({
                where: {
                    roomid: parseInt(roomid),
                }
            })

            res.send(JSON.stringify(csgi_room));
        } else{
            res.send(JSON.stringify({ "status": 302, "error": 'Missing identifier' }));
            return;
        }       
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }

}

/**
 * Create/Capture room
 * @function addNewRoom function name
 * @param req receive request as input
 * @param res send response back to calling function
 * @Query (roomcode) unique to identify already existing classroom
 */
async function addNewRoom(req, res) {
    const { roomid, roomcode, room_desc, location, created_date, created_by, updated_date, updated_by } = req.body
    let lv_username = req.body.username  // get from session to do 
    //let lv_Date          = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        console.log('addNewRoom: ', dateNow);
        const csgi_room = await prisma.csgi_room.findFirst({
            where: {
                roomcode: roomcode,
            }
        })

        console.log('room: ', csgi_room);
        console.log('room: ', roomcode, ' location: ', location);
        if (csgi_room) {
            res.send(JSON.stringify({ "status": 302, "error": 'room details already exists' }));
            return;
        }

        try {
            console.log('room register Start: ', dateNow);
            const roomCreate = await prisma.csgi_room.createMany({
                data: [{
                    roomcode: roomcode,
                    room_desc: room_desc,
                    location: location,
                    created_by: created_by,
                },
                ],
                skipDuplicates: true,
            })
            console.log('room creation successful roomid: ', roomCreate.roomid);
            res.send(JSON.stringify(roomCreate));
        }
        catch (err) {
            res.send(JSON.stringify({ "status": 500, "error": ' registering room ' + err, "response": null }));
        }
    }
    catch (err) {
        res.send(JSON.stringify({ "status": 500, "error": 'In room ' + err, "response": null }));
    }
}

/**
 * Update one or many room
 * @function updateroom function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updateRoom(req, res) {
    const { roomcode, room_desc, location, updated_date, updated_by } = req.body
    let roomid = req.params.id
    var post_room = {}
    var lv_updatedby = updated_by //req.body.username
  //  let lv_DoB = date.addDays(date.parse(date_of_birth, 'YYYY-MM-DD'), 1);   // timezone issues GMTz 

    try {
        if (check(roomid).notEmpty()) {
            post_room = await prisma.csgi_room.updateMany({
                where: { roomid: parseInt(roomid), },
                data: {
                    roomcode: roomcode,
                    room_desc: room_desc,
                    location: location,
                    updated_date: dateNow,
                    updated_by: updated_by,
                },
            })

            console.log('Room update successful roomId: ', roomid);
            res.send(JSON.stringify(post_room));
        } else{
            res.send(JSON.stringify({ "status": 302, "error": 'Missing identifier' }));
            return;
        }
        
    }
    catch (err) {
        console.log('updateroom error:', err)
        res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
    }
}

/**
 * Delete user take caution when using this
 * @function updateroom function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deleteRoom(req, res) {
    let roomid = req.params.id
    var del_room = {}

    try {
        // delete one Csgi_user based on unique email
        if (check(roomid).notEmpty()) {
            del_room = await prisma.csgi_room.deleteMany({
                where: {
                    roomid: parseInt(roomid),
                }
            })

        console.log('room deleted successful roomid: ', roomid);
        res.send(JSON.stringify({"response": 'room delete success' }));
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
    getAllRooms,
    getSingleRoom,
    addNewRoom,
    updateRoom,
    deleteRoom
}