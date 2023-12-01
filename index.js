require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 8000
const md5 = require('md5')
const User = require('./models/user.model.js')

const studentsFile = JSON.parse(fs.readFileSync("./data/students.json"));

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri)

//this is a post request to make a new student, sign up
app.post("/SignUp", (req, res) => {
    //this takes the request body from the front end and adds a unique id also
    //this takes the request body from the front end and adds a unique id also
    const newStudent = {
        id: uuid(),
        password: md5(req.body.password),
        email: req.body.email,
        name: req.body.name,
        semesters: [
            {
                semester: {
                    semesterName: "fall2023",
                    classes: [
                        {
                            className: "Meth",
                            grade: ""
                        },
                        {
                            className: "Radding",
                            grade: ""
                        },
                        {
                            className: "",
                            grade: ""
                        },
                        {
                            className: "",
                            grade: ""
                        },
                        {
                            className: "",
                            grade: ""
                        },
                        {
                            className: "",
                            grade: ""
                        }
                    ]
                }
            }
        ]
    };

    //this adds a new student to the data file containing all students
    let updatedStudents = [...studentsFile, newStudent];
    fs.writeFileSync(
        "./data/students.json",
        JSON.stringify(updatedStudents)
    );

    //this sends a status to the front end and sends it the updated list of students
    res.status(201).json(updatedStudents);

    // mongo setup, add "async" before (req,res) to make the await work
    // try{
    //     const user = await User.create({
    //         id: uuid(),
    //         email: req.body.email,
    //         password: md5(req.body.password),
    //         name: req.body.name
    //     });
    //     await user.save()

    //     //this sends a status to the front end and sends it the new student
    //     res.status(201).json(newStudent);
    // } catch (e) {
    //     console.log(e.message)
    // }
});

app.post("/LogIn", (req, res) => {
    //this takes the request body from the front end and adds a unique id also

    studentsFile.map((student) => {
        if (student.email === req.body.email && student.password === md5(req.body.password)) {
            res.status(201).json(student);
        }
    })

    //this sends a status to the front end and sends it the updated list of students
});

app.post("/LogInCode", (req, res) => {
    //this takes the request body from the front end and adds a unique id also

    studentsFile.map((student) => {
        if (student.accessCode === req.body.accessCode) {
            res.status(201).json(student);
        }
    })

    //this sends a status to the front end and sends it the updated list of students
});

app.post("/EditStudent", (req, res) => {
    const studentId = req.body.id;
    const studentInfo = req.body;

    let editStudent = studentsFile.filter(
        (student) => student.id !== studentId
    );

    const newData = editStudent.flat();
    newData.push(studentInfo);

    fs.writeFileSync("./data/students.json", JSON.stringify(newData));

    res.status(201).json(studentInfo);
});

app.post("/ChangePassword", (req, res) => {
    studentsFile.map((student) => {
        if (student.email === req.body.email) {
            student.password = md5(req.body.password)
            res.status(201).json(student);
        }
    })
});


app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});