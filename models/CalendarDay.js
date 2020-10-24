const mongoose = require('mongoose')

const calendarDaySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  foods: {
    type: Array,
    required: true,
    default: []
  },
  createdBy: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('CalendarDay', calendarDaySchema)