const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const schema = mongoose.Schema;
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
var mongoosePaginate = require("mongoose-paginate");

let userModel = new schema({
    fullName:{
        type: String,
    },
    email:{
        type: String,
        lowercase: true,
    },
    country:{
        type: String,
    },
    mobileNumber:{
        type: String,
    },
    token:{
      type:String
    },
    tempMobileNumber:{
        type: String,
    },
    tempCountryCode:{
        type: String,
    },
    password:{
        type:String,
    },
    pin:{
        type:String
    },
    otp:{
        type:Number
    },
    verifyOtp:{
        type:Boolean,
        default:false
    },
    profilePic:{
        type:String
    },
    userName:{
      type: String,
    },
    Annual_Income_Before_Taxes:{
      type: String,
    },
    Weekely_Expenses:{
      type: String

    },
    Total_Investment:{
      type: String

    },
    Annual_Saving:{
      type: String

    },
    userType: {
        type: String,
        enum: ["ADMIN", "USER"],
        default: "USER"
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED", "DELETED"],
        default: "ACTIVE"
    },

}, {
    timestamps: true
})
userModel.plugin(mongoosePaginate);
userModel.plugin(mongooseAggregatePaginate);
var users = mongoose.model("users", userModel);
module.exports = users;

mongoose.model("users", userModel).find({ userType: "ADMIN" }, (err, result) => {
    if (err) {
      console.log("DEFAULT ADMIN ERROR", err);
    } else if (result.length != 0) {
      console.log("DEFAULT ADMIN CREATED ALREADY...");
    } else {
      let obj = {
        userType: "ADMIN",
        fullName: "umair khan",
        country: "INDIA",
        verifyOtp:true,
        profilePic:
          "https://res.cloudinary.com/dkoznoze6/image/upload/v1563943105/n7zdoyvpxxqhexqybvkx.jpg",
        mobileNumber: "+919560440056",
        email: "no-umairkhan@mobiloitte.com",
        password: bcrypt.hashSync("umair")
      };
      mongoose.model("users", userModel).create(obj, (err1, result1) => {
        if (err1) {
          console.log("DEFAULT ADMIN  creation ERROR", err1);
        } else {
          console.log("DEFAULT ADMIN Created", result1);
        }
      });
    }
  });


