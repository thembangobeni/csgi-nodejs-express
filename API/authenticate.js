const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _  = require('lodash');
const jwt = require('jsonwebtoken');
const { check, oneOf } = require('express-validator');
const validator = require('validator');
const SECRET = 'asbadbbdbbh7788888887hb113h3hbb';



const prisma = new PrismaClient() // use `prisma` in your application to read and write data in your DB

/**
 * get all Periods Admin
 * @function login function name
 * @param req receive request as input
 * @param res send response back to calling function
 */
async function login(req, res){
  try{
    //get users
    const user = await prisma.csgi_user.findUnique({
      where: {
          email: req.body.email,
        }
    })

    console.log('user: ', user);

    if (!user) 
    {
      res.send(JSON.stringify({"status": 404, "error": 'Incorrect username or email', "token": null}));
      return;
    }

    console.log('user provided pass: ', req.body.password, 'database Password: ', user.password);
    const valid = await bcrypt.compare(req.body.password, user.password);
    console.log('user provided pass: ', req.body.password, 'database Password: ', user.password);
    if (!valid){
      res.send(JSON.stringify({"status": 404, "error": 'Incorrect password', "token": null}));
      return;
    }

    // verify: needs SECRET | use for authentication
    // decode: no secret | use for client side 
    const token = jwt.sign({
      user: _.pick(user, ['userid', 'email']),
    }, 
    SECRET,
    {
      expiresIn: '10m',
    });
    res.send(JSON.stringify({"status": 200, "error": null, "token": token}));

  } catch (err){
    res.send(JSON.stringify({ "status": 500, "error": err, "response": null }));
  }
  }

module.exports = {
    login
   // logout
}