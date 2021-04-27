import express from 'express'
//let express = require('express');   // Strict Typescript and implicity

const { PrismaClient } = require('@prisma/client');
const { getAllStudents, getSingleStudent, addNewStudent, updateStudent, deleteStudent } = require('../API/student');
const { getAllUsers, getSingleUser, updateUser, deleteUser } = require('../API/users');
const { getAllRooms, getSingleRoom, addNewRoom, updateRoom, deleteRoom } = require('../API/room');
const { getAllGrades, getSingleGrade, addNewGrade, updateGrade, deleteGrade } = require('../API/grade');
const { getAllPeriods, getSinglePeriod, addNewPeriod, updatePeriod, deletePeriod } = require('../API/period');
const { getAllClasses, getSingleClass, addNewClass, updateClass, deleteClass } = require('../API/class');
const { getAllRosters, getSingleRoster, addNewRoster, updateRoster, deleteRoster } = require('../API/roster');
const { getAllTeachers, getSingleTeacher, getAllSummaryReport, getAllDetailReport, getAllSummaryQuarter } = require('../API/dbviews');
const { login } = require('../API/authenticate');
const { registerUser } = require('../API/register');
var cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

/* still to do Menu, MenuRole,UserRole
//const { login, logout, getAllUsers, getSingleUser, registerUser, updateUser, deleteUser } = require('../API/users');
const { getAllClasses, getSingleClass, addNewClass, updateClass, deleteClass } = require('./API/class');
const { getAllRosters, getSingleRoster, addNewRoster, updateRoster, deleteRoster } = require('./API/roster');
const { getAllGrades, getSingleGrade, addNewGrade, updateGrade, deleteGrade } = require('./API/grade');
const { getAllRooms, getSingleRoom, addNewRoom, updateRoom, deleteRoom } = require('./API/room');
const {getAllPeriods, getSinglePeriod, addNewPeriod, updatePeriod, deletePeriod } = require('./API/period');
*/
const prisma = new PrismaClient()
const app = express()


app.use(express.json(), morgan('combined'), cors(), bodyParser.urlencoded({extended: true}))

// ... your REST API routes will go here

app.get('/', async (req, res) => {
  res.json("Server is up..")
})

// app.get('/api/users',getAllUsers);  --testing works

// ####################### Users: #########################
app.get('/api/users', getAllUsers);
app.get('/api/users/:id', getSingleUser);
app.put('/api/users/:id', updateUser);
app.delete('/api/users/:id', deleteUser);

// ####################### Authenticate: ###################
app.post('/api/authenticate', login);
app.post('/api/register', registerUser);

// ####################### Students: #######################
app.get('/api/student', getAllStudents);
app.get('/api/student/:id', getSingleStudent);
app.post('/api/student', addNewStudent);
app.put('/api/student/:id', updateStudent);
app.delete('/api/student/:id', deleteStudent);


// ####################### Class: ##########################
app.get('/api/class',getAllClasses);
app.get('/api/class/:id',getSingleClass);
app.post('/api/class',addNewClass);
app.put('/api/class/:id',updateClass);
app.delete('/api/class/:id',deleteClass);

// ####################### Teacher Roster: #######################
app.get('/api/roster',getAllRosters);
app.get('/api/roster/:id',getSingleRoster);
app.post('/api/roster',addNewRoster);
app.put('/api/roster/:id',updateRoster);
app.delete('/api/roster',deleteRoster);


// ####################### Grades: #######################
app.get('/api/grade',getAllGrades);
app.get('/api/grade/:id',getSingleGrade);
app.post('/api/grade',addNewGrade);
app.put('/api/grade/:id',updateGrade);
app.delete('/api/grade/:id',deleteGrade);

// ####################### ClassRooms: #######################
app.get('/api/room', getAllRooms);
app.get('/api/room/:id', getSingleRoom);
app.post('/api/room', addNewRoom);
app.put('/api/room/:id', updateRoom);
app.delete('/api/room/:id', deleteRoom);


// ####################### Period: ###########################
app.get('/api/period',getAllPeriods);
app.get('/api/period/:id',getSinglePeriod);
app.post('/api/period',addNewPeriod);
app.put('/api/period/:id',updatePeriod);
app.delete('/api/period/:id',deletePeriod);

// ####################### Report: ###########################
app.get('/api/dbviews',getAllTeachers);
app.get('/api/dbviews/:id',getSingleTeacher);
app.get('/api/dbviews/:id/:classid/',getAllSummaryReport);     // 
app.get('/api/dbviews/:id/:classid/:gradeid',getAllDetailReport);    //
app.get('/api/dbviews/:id/:classid/:gradeid/:quarter',getAllSummaryQuarter);  //


app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)

module.exports = app;