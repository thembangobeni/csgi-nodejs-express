const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
//const SECRET = 'asbadbbdbbh7788888887hb113h3hbb';


const prisma = new PrismaClient() // use instantiate `prisma` in your application to read and write data in your DB

// register user, but check first if unique email already exists
async function registerUser(req, res){
    const { username, email, first_name, last_name, password  } = req.body 
    let {locemail}      = req.body.email 
    var local_pass ={}

    try
    {
      console.log('registerUser email: ', req.body );
      const user = await prisma.csgi_user.findUnique({
        where: {
            email: email,
      }
      })
  
      console.log('user: ', user);
      console.log('user: ', username, ' pass ', password);
      if(user)
      {
        res.send(JSON.stringify({"status": 302, "error": 'User email already exists'}));
        return;
      }
  
      local_pass = await bcrypt.hash(password, 12);
  
      try
      {
        console.log('password: ', local_pass);
  
        const userCreate = await prisma.csgi_user.createMany({ 
            data: [{
                  username: username,
                  email: email,
                  first_name: first_name,
                  last_name: last_name,  
                  password: local_pass,
            },
          ],
          skipDuplicates: true,
        })
        console.log('User creation successful userid: ', userCreate.userid);
        res.send(JSON.stringify({"status": 200, "error": null, "response": userCreate}));
      }
      catch(err)
      {
        res.send(JSON.stringify({"status": 500, "error": ' registering User '+err, "response": null}));
      }
    }
    catch(err)
    {
      res.send(JSON.stringify({"status": 500, "error": 'In user '+err, "response": null}));
    }     
  }


module.exports = {
    registerUser
}