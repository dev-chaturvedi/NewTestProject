const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const schema = mongoose.Schema;
var mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
var mongoosePaginate = require("mongoose-paginate");

let userKycModel = new schema(
  {
    fullLegalName: {
      type: String
    },
    dateOfBirth: {
      type: String
    },
    nationality: {
      type: String
    },
    homeAddress: [{
        addressLine:{
            type:String
        },
        other:{
            type:String
        },
        city:{
            type:String
        },
        state:{
            type:String
        },
        zipCode:{
            type:String
        },
        country:{
            type:String
        }
    }],
    selfie:[ {
    type:String
    }],   
    identificationDocument:[{
        name:{
            type:String
        },
        front:{
            type:String
        },
        back:{
            type:String
        }
    }],
    status: {
        type: String,
        enum: ["PENDING", "COMPLETED","REJECT"],
        default: "PENDING"
      }
  },
  { timestamps: true }
);
userKycModel.plugin(mongoosePaginate);
userKycModel.plugin(mongooseAggregatePaginate);
var userKyc = mongoose.model("userKycModel", userKycModel);
module.exports = userKyc;


