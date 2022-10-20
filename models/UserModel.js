const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email",
         ],
      },
      password: {
         type: String,
      },
      img: {
         type: String,
         default:
            "https://firebasestorage.googleapis.com/v0/b/clone-4b64f.appspot.com/o/profileicon.png?alt=media&token=d5cd442e-6bcb-4ef6-a6ad-f1b4307dfa55",
      },
      coverImg: {
         type: String,
         default:
            "https://firebasestorage.googleapis.com/v0/b/clone-4b64f.appspot.com/o/default_banner-vflYp0HrA.jpg?alt=media&token=5887532e-bdb5-41e6-a2bc-e08bfc50f2a9",
      },
      subscriber: {
         type: Number,
         default: 0,
      },
      subscribedUsers: {
         type: [String],
         default: [],
      },
      fromGoogle: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
