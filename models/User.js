const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
      min: 3,
      max: 20,
    },

    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
    },

    phone: {
      type: String,
      required: true,
    },
       value: {
        type : String,
        required: true,
       }
    },

  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
