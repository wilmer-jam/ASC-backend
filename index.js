const express = require("express");
const cors = require("cors");
const app = express();
const fs = require("fs");
const { v4: uuid } = require("uuid");

const studentsFile = JSON.parse(fs.readFileSync("./data/students.json"));

app.use(cors());
app.use(express.json());

//this is a post request to make a new student, sign up
app.post("/SignUp", (req, res) => {
    //this takes the request body from the front end and adds a unique id also
    const newStudent = {
        id: uuid(),
        ...req.body,
    };

    //this adds a new student to the data file containing all students
    let updatedStudents = [...studentsFile, newStudent];
    fs.writeFileSync(
        "./data/students.json",
        JSON.stringify(updatedStudents)
    );

    //this sends a status to the front end and sends it the updated list of students
    res.status(201).json(updatedStudents);
});

app.post("/LogIn", (req, res) => {
    //this takes the request body from the front end and adds a unique id also

    studentsFile.map((student) => {
        if (student.email === req.body.email) {
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
            student.password = req.body.password
            res.status(201).json(student);
        }
    })
});


app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});