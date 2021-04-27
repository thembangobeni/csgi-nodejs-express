const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _  = require('lodash');
const { check, oneOf } = require('express-validator');
const validator = require('validator');

const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB

/**
 * select all users
 * @function getAllUsers function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getAllUsers(req, res) {
    console.log('getAllUsers: Start')
    try {
        const allUsers = await prisma.csgi_user.findMany()

        res.send(JSON.stringify({"status": 200, "error": null, "response": allUsers}));
        console.log('getAllUsers: success')
    } 
    catch (err) {
            console.log('getAllUsers error:', err)
            res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
        }
}

/**
 * select single user
 * @function getSingleUser function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function getSingleUser(req, res) {
    let id = req.params.id
    var csgi_user = {}
    console.log('getSingleUser: Start')
    try {

        if (check(id).isEmail().notEmpty()) {
            csgi_user = await prisma.csgi_user.findUnique({
                where: {
                    email: id,
                }
            })
      
        }

         if (parseInt(id) && check(id).notEmpty()) {
                let local_id = parseInt(id)
                csgi_user = await prisma.csgi_user.findUnique({
                    where: {
                        userid: local_id,
                    }
                })
               // res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_user}));
          }
          res.send(JSON.stringify({"status": 200, "error": null, "response": csgi_user}));    
    } catch (err) {
         console.log('getSingleUser error:', err)
         res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
         }

}

/**
 * Update users
 * @function updateUser function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function updateUser(req, res) {
    const { userid, username, email, first_name, last_name, password, updated_date, updated_by  } = req.body
    let idParam = req.params.id
    var post_user = {}

    try {
        if (check(idParam).isEmail().notEmpty()) {
            post_user = await prisma.csgi_user.updateMany({
                where: { email: idParam, },
                data: {  
                    username: username, 
                    first_name: first_name, 
                    last_name: last_name, 
                    password: await bcrypt.hash(password, 12), //--when create password is hashed
                    updated_date: updated_date, 
                    updated_by: updated_by,
                },
            })
        }

        if (parseInt(idParam) && check(idParam).notEmpty()) {
            let local_id = parseInt(idParam)
            post_user = await prisma.csgi_user.updateMany({
                where: {
                    userid: local_id,
                },
                data: {  
                    username: username, 
                    email: email,
                    first_name: first_name, 
                    last_name: last_name, 
                    password: await bcrypt.hash(password, 12), //--when create password is hashed
                    updated_date: updated_date, 
                    updated_by: updated_by,
                }, 
            })
        }

      console.log('User update successful userid: ', idParam);
      res.send(JSON.stringify({"status": 200, "error": null, "response": 'Update successful'}));

    } catch (err) { 
        console.log('updateUser error:', err) 
        res.send(JSON.stringify({"status": 500, "error": err, "response": null}));  
   }
}


//Delete user take caution when using this
/**
 * delete a user
 * @function deleteUser function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function deleteUser(req, res){
    let id = req.params.id
    var del_user = {}

    try {
        if (check(id).isEmail().notEmpty()) {
            del_user = await prisma.csgi_user.deleteMany({
                where: {
                    email: id,
                }
            })
        }

        if (parseInt(id) && check(id).notEmpty()) {
            let local_id = parseInt(id)
            del_user = await prisma.csgi_user.deleteMany({
                where: {
                    userid: local_id,
                }
            })
        }
        console.log('User deleted successful userid: ', id);
        res.send(JSON.stringify({"status": 200, "error": null, "response": 'user delete success'}));
    } 
    catch(err)  {
        res.send(JSON.stringify({"status": 500, "error": err, "response": null}));
    }

  }

module.exports = {
    getAllUsers,
    getSingleUser,
    updateUser, 
    deleteUser
}




