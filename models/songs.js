const mongoose = require('mongoose')
const SongsSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    Artist: {
      type: String,
      required: true,
    },
    NumberOfPlays: {
      type: Number,
      default:0
    },
    link: {
      type: String,
      required: true
    },
  })

  module.exports = mongoose.model('songs', SongsSchema)