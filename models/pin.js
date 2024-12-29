const mongoose = require('mongoose');

let pinSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      lowercase: true
    },
    description: {
      type: String
    },
    thumbnail: {
      public_id: {
        type: String,
        require: true
      },
      url: {
        type: String,
        require: true
      }
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Pin', pinSchema);
