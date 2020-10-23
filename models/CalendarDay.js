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
  offsetX: {
    type: Number,
    required: true,
    default: 0
  },
  offsetY: {
    type: Number,
    required: true,
    default: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageId: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('CalendarDay', calendarDaySchema)