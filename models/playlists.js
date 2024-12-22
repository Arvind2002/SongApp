const mongoose = require('mongoose')
const PlaylistsSchema = new mongoose.Schema({
    Name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    songs: [{
      Name: {
        type: String,
      },
      duration: {
        type: String,
      },
      Artist: {
        type: String,
      },
      NumberOfPlays: {
        type: Number,
      },
      link: {
        type: String,
        default: null,
      },
    }],
    LastModified: {
        type: Date,
        default: Date.now,
    }
  })

  module.exports = mongoose.model('Playlists', PlaylistsSchema)