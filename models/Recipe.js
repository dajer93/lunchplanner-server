const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  ingredients: {
    type: Array,
    required: true,
    default: []
  },
  createdBy: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Recipe', recipeSchema)