const { UUID } = require('mongodb');
const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
  className: String,
  grade: String,
  gradeWeight: Number,
  creditHours: Number
})

const userSchema = new mongoose.Schema({
  _id: UUID,
  email: { type: String, required: true, validate: {
    validator: v => v.includes("@"),
    message: props => `${props.value} is not a valid email address`
  } },
  password: { type: String, required: true },
  accessCode: Number,
  semesters: [
    {
      semester: {
        semesterName: String,
        classes: [classSchema]
      }
    }
  ]
})

const User = mongoose.model('User', userSchema);

module.exports = User;