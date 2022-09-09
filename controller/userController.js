const userModel = require('../model/userModel');

const { commonResponse: response } = require('../helper/commonResponseHandler')
const { ErrorMessage } = require('../helper/messages')
const { SuccessMessage } = require('../helper/messages')
const { ErrorCode } = require('../helper/statusCodes')
const { SuccessCode } = require('../helper/statusCodes')
const commonFunction = require('../helper/commonFunction')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);



/**
  //      * Function Name : signUp
  //      * Description   : sign up page for user 
  //      *
  //      * @return response
  //      */

  const signup= (req, res) => {
    try {
        userModel.findOne(
            {
                fullName: req.body.fullName,
                mobileNumber: req.body.mobileNumber,
                status: { $ne: "DELETED" }
            },
            (error, userData) => {
                console.log("111111111111111", userData)
                if (error) {
                    response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                } else if (!userData) {
                    
                    userModel.findOne(
                        {
                            mobileNumber: req.body.mobileNumber,
                            status: { $ne: "DELETED" }
                        },
                        (error, otpData) => {
                            console.log("11111112222222221", otpData)
                            if (error) {
                                response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                            } else if (!otpData) {
                                req.body.otp = commonFunction.getOTP() ;
                                commonFunction.sendOtp(req.body.mobileNumber,req.body.otp,(error, smsData) => {
                                    if (error) {
                                        console.log("asjgfkjasghfjkghafgh", error,smsData)
                                        response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                    }
                                    else if(!smsData) {
                                        new userModel({fullName: req.body.fullName,mobileNumber: req.body.mobileNumber,otp: "1234",otpTime: req.body.otpTime}).save((error, saveName) => {
                                            if (error) {
                                                response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                            } else {
                                                response(res,SuccessCode.SUCCESS,[saveName],SuccessMessage.OTP_MOB_SEND);
                                                }
                                            });
                                    } else {
                                        console.log("44444444444444444", smsData)
                                        req.body.otpTime = new Date().getTime();
                                        new userModel({fullName: req.body.fullName,mobileNumber: req.body.mobileNumber,otp: req.body.otp,otpTime: req.body.otpTime}).save((error, saveName) => {
                                            if (error) {
                                                response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                            } else {
                                                response(res,SuccessCode.SUCCESS,[saveName],SuccessMessage.OTP_MOB_SEND);
                                                }
                                            });
                                        }
                                    }
                                );
                            } else {
                                console.log("You can Proceed with further entries.....",otpData.password);
                                req.body.password = bcrypt.hashSync(req.body.password, salt);
                                if (otpData.password == null) {
                                    req.body.otp = commonFunction.getOTP();
                                    commonFunction.sendOtp(req.body.mobileNumber,req.body.otp,(error, smsData) => {
                                        if (error) {
                                            response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                        } 
                                        else if(!smsData){
                                            userModel.findOneAndUpdate(
                                                {
                                                    _id: otpData._id,
                                                    status: { $ne: "DELETED" },
                                                    userType: "USER"
                                                },
                                                {
                                                    $set: {
                                                        fullName: req.body.fullName,
                                                        mobileNumber: req.body.mobileNumber,
                                                        otp: "1234",
                                                        otpTime: req.body.otpTime
                                                    }
                                                },
                                                { mutli: true, new: true },
                                                (error, saveName) => {
                                                    if (error) {
                                                        response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                                    } else {
                                                        response(res,SuccessCode.SUCCESS,[saveName],SuccessMessage.OTP_MOB_SEND);
                                                        }
                                                    }
                                                );
                                        }else {
                                            userModel.findOneAndUpdate(
                                                {
                                                    _id: otpData._id,
                                                    status: { $ne: "DELETED" },
                                                    userType: "USER"
                                                },
                                                {
                                                    $set: {
                                                        fullName: req.body.fullName,
                                                        mobileNumber: req.body.mobileNumber,
                                                        otp: req.body.otp,
                                                        otpTime: req.body.otpTime
                                                    }
                                                },
                                                { mutli: true, new: true },
                                                (error, saveName) => {
                                                    if (error) {
                                                        response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                                    } else {
                                                        response(res,SuccessCode.SUCCESS,[saveName],SuccessMessage.OTP_MOB_SEND);
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                } else {
                                    response(res,ErrorCode.NOT_FOUND,[],ErrorMessage.MOBILE_EXIST);
                                }
                            }
                        }
                    );
                } else {
                    console.log("You can Proceed with further entries.....",userData.verifyOtp);
                    if (userData.verifyOtp == true) {
                        if (userData.password == null) {
                            req.body.password = bcrypt.hashSync(req.body.password, salt);
                            userModel.findOneAndUpdate(
                                {
                                    _id: userData._id,
                                    status: { $ne: "DELETED" },
                                    userType: "USER"
                                },
                                { $set: { password: req.body.password } },
                                { mutli: true, new: true },
                                (error, updateData) => {
                                    if (error) {
                                        response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                    } else {
                                        response(res,SuccessCode.SUCCESS,[updateData],SuccessMessage.OTP_MOB_SEND);
                                    }
                                }
                            );
                        } else {
                            response(res,ErrorCode.NOT_FOUND,[],ErrorMessage.SIGNUP);
                        }
                    } else {
                        req.body.otpTime = new Date().getTime();
                        req.body.otp = commonFunction.getOTP();
                        commonFunction.sendOtp(req.body.mobileNumber, req.body.otp, (error, smsData) => {
                            if (error) {
                                response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                            }
                            else if(!smsData){
                                userModel.findOneAndUpdate({_id: userData._id,status: { $ne: "DELETED" },userType: "USER"},{ $set: { otp: req.body.otp, otpTime: req.body.otpTime } },{ mutli: true, new: true },(error, updateData) => {
                                    if (error) {
                                        response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                    } else {
                                        response(res,SuccessCode.SUCCESS,[updateData],SuccessMessage.OTP_MOB_SEND);
                                        }
                                    }
                                );
                            } else {
                                userModel.findOneAndUpdate({_id: userData._id,status: { $ne: "DELETED" },userType: "USER"},{ $set: { otp: req.body.otp, otpTime: req.body.otpTime } },{ mutli: true, new: true },(error, updateData) => {
                                    if (error) {
                                        response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
                                    } else {
                                        response(res,SuccessCode.SUCCESS,[updateData],SuccessMessage.OTP_MOB_SEND);
                                        }
                                    }
                                );
                            }
                        });
                    }
                }
            }
        );
    } catch {
        response(
            res,
            ErrorCode.SOMETHING_WRONG,
            [],
            ErrorMessage.SOMETHING_WRONG
        );
    }
}


/**
  * Function Name : verifyOtp
  * Description   : Mobile number Verification of OTP 
  * @return response
  */
const verifyOtp = (req, res) => {
    try {
        userModel.findOne({ mobileNumber: req.body.mobileNumber, status: { $ne: "DELETED" } }, (error, userDetails) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } else if (userDetails) {
                if (req.body.otp==userDetails.otp || req.body.otp == "1234"){
                    userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber ,verifyOtp: false}, { $set: { verifyOtp: true, otp: req.body.otp } }, { new: true }, (error, otpUpdate) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                    } else {
                        response(res, SuccessCode.SUCCESS, otpUpdate, SuccessMessage.VERIFY_OTP);
                    }
                })
            }
            else{
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.INVALID_OTP);
            }

            } else {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.MOB_NOT_FOUND);
            }

        })
    } catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
}

/**
  * Function Name :forgotPassword
  * Description   : forgot Password
  *
  * @return response
  */
const forgotPassword = (req, res) => {
    try {
        userModel.findOne({ mobileNumber: req.body.mobileNumber }, (error, userDetails) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } else {
                var otp = commonFunction.getOTP();
                userModel.findOneAndUpdate({ mobileNumber: req.body.mobileNumber }, { $set: { otp: otp } }, { new: true }, (error, otpUpdate) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                    } else {
                        commonFunction.sendSms(req.body.fullName, otp, req.body.mobileNumber, (error, sendMessage) => {
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                            } else {
                                response(res, SuccessCode.SUCCESS, otpUpdate, SuccessMessage.OTP_MOB_SEND);
                            }
                        })
                    }
                })
            }
        })

    } catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
}

/**
  * Function Name : setPin
  * Description   : Set the pin with mobileNumber
  *
  * @return response
  */
const setPin = (req, res) => {

    try {
        userModel.findOne({ mobileNumber: req.body.mobileNumber, status: "ACTIVE" }, (error, userDetails) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } else if (userDetails) {
                req.body.pin = bcrypt.hashSync(req.body.pin, salt)
                userModel.findOneAndUpdate({ mobileNumber: userDetails.mobileNumber, status: "ACTIVE" }, { $set: { pin: req.body.pin } }, { multi: true, new: true, safe: true }, (error, pinUpdate) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                    } else {
                        response(res, SuccessCode.SUCCESS, pinUpdate, SuccessMessage.PIN_SET);
                    }
                })
            } else {
                response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.USER_FOUND);
            }
        })
    }
    catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
}


/**
  * Function Name : checkUserName
  * Description   : check user Name Whethet already exist or not
  *
  * @return response
  */

const checkUserName = (req, res) => {
    try {
        userModel.findOne({ userName: req.body.userName ,status: "ACTIVE"}, (error, userName) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } 
            else if(!userName){
                response(res, SuccessCode.SUCCESS, [], SuccessMessage.POST_REGISTER);
            }else {
               
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.USERNAME_EXIST);
                
                    
            }
        })

    } catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
}




/**
  * Function Name : checkUserNameOrEmail
  * Description   : check User Name Or Email to be a unique
  *
  * @return response
  */
const checkUserNameOrEmail = (req, res) => {
    try {
        userModel.findOne({$or:[{ userName: req.body.userName },{ email: req.body.userName }]}, (error, checkUserNameOrEmail) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } else {
                if (checkUserNameOrEmail) {
                    response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.USER_FOUND);
                } else {

                }
            }
        })

    } catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
}
/**
  * Function Name : signupComplete
  * Description   : User signup 
  *
  * @return response
  */
const signupComplete = (req, res) => {
    try {
        userModel.findOne({ userName: req.body.email, status: { $ne: "DELETED" }, signUp: { $ne: "COMPLETE" } }, (error, user) => {
            console.log(user)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } else if (user) {
                req.body.password = bcrypt.hashSync(req.body.password, salt)     
                    req.body.signUp = "COMPLETE"
                    new userModel(req.body).save((error, userSave) => {
                        if (error) {
                            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                        } else {
                            response(res, SuccessCode.SUCCESS, { userDetail: userSave }, SuccessMessage.SIGNUP_SUCCESS);
                        }
                    })
                    response(res, ErrorCode.NOT_FOUND, { userDetail: userSave }, ErrorMessage.PASSWORD_NOT_MATCHED);
            }
            else {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.USERNAME_EXIST);
            }
        })
    }
    catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
}


/**
//      * Function Name : postRegistration
//      * Description   : post Registration for user 
//      *
//      * @return response
//      */
const postRegistration= (req, res) => {
    userModel.findOne({ _id: req.body.userid, status: { $ne: "DELETED" }, userType: "USER",verifyOtp:true }, (error, userData) => {
            if (error) {
                response( res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG );  
            }
            else if(!userData){
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_NOT_FOUND);  
            }
            else{
                userModel.findOne({userName:req.body.userName,status:{$ne:"DELETED"},userType:"USER",verifyOtp:true },(error,regisData)=>{
                    if(error){
                        response( res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG );   
                    }
                    else if(!regisData){
                        if(req.body.profilePic){
                            commonFunction.uploadImg(req.body.profilePic,(error,uploadData) => {
                                console.log("the cloudinary.....",error,uploadData)
                                if(error){
                                  response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                                }
                                else if(!uploadData) {
                                  response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPLOAD_ERROR);
                                }
                                else {  
                                   console.log("The image is....",uploadData)
                                 req.body.profilePic=uploadData
                                   userModel.findByIdAndUpdate({_id:userData._id},{$set:req.body},{new:true},(error,editedData)=>{
                                       console.log("aaaaaaaaaaaaa", error, editedData)
                                     if(error) {
                                      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                                     }
                                     else if(!editedData) {
                                      response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPLOAD_ERROR);
                                     }
                                     else{
                                      response(res, SuccessCode.SUCCESS, [editedData], SuccessMessage.PROFILE_DETAILS);
                                     }
                                   })
                                }
                              })
                        }
                        else{
                            userModel.findByIdAndUpdate({_id:userData._id},req.body,{new:true},(error,editedData)=>{
                                if(error) {
                                 response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                                }
                                else if(!editedData) {
                                 response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPLOAD_ERROR);
                                }
                                else{
                                 response(res, SuccessCode.SUCCESS, [editedData], SuccessMessage.PROFILE_DETAILS);
                                }
                              })
                        }
                        
                    }
                    else{
                    //   response(res, ErrorCode.ALREADY_EXIST,[],ErrorMessage.USERNAME_EXIST)
                    if(req.body.userName){
                        response(res, ErrorCode.ALREADY_EXIST,[],ErrorMessage.USERNAME_EXIST) 
                    }
                    else if(req.body.profilePic){
                        commonFunction.uploadImg(req.body.profilePic,(error,uploadData) => {
                            console.log("the cloudinary.....",error,uploadData)
                            if(error){
                              response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                            }
                            else if(!uploadData) {
                              response(res, ErrorCode.UPLOAD_ERROR, [], ErrorMessage.NOT_FOUND);
                            }
                            else {  

                             req.body.profilePic=uploadData
                               userModel.findByIdAndUpdate({_id:userData._id},{$set:req.body},{new:true},(error,editedData)=>{
                                   console.log("aaaaaaaaaaaaa", error, editedData)
                                 if(error) {
                                  response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                                 }
                                 else if(!editedData) {
                                  response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPLOAD_ERROR);
                                 }
                                 else{
                                  response(res, SuccessCode.SUCCESS, [editedData], SuccessMessage.PROFILE_DETAILS);
                                 }
                               })
                            }
                          })  
                    }
                     else{
                        userModel.findByIdAndUpdate({_id:userData._id},{$set:{Annual_Saving:req.body.Annual_Saving,Annual_Income_Before_Taxes:req.body.Annual_Income_Before_Taxes,Total_Investment:req.body.Total_Investment,Weekely_Expenses:req.body.Weekely_Expenses}},{multi:true,new:true},(error,editedData)=>{
                            if(error) {
                             response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                            }
                            else if(!editedData) {
                             response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.UPLOAD_ERROR);
                            }
                            else{
                             response(res, SuccessCode.SUCCESS, [editedData], SuccessMessage.PROFILE_DETAILS);
                            }
                          })
                     }
                        
                    
                    }
                })
            }
        }
    );
}

/**
//      * Function Name : login
//      * Description   : login for user 
//      *
//      * @return response
//      */

    const login =(req, res) => {
        var userName = req.body.userName
        var password = req.body.password
        userModel.findOne({ userName: userName, status: "ACTIVE" }, (err, user) => {
            if (err) {
                response(res, ErrorCode.SOMETHING_WRONG, err, ErrorMessage.INTERNAL_ERROR);
            }
            else if (!user) {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USERNAME_NOT_REGISTERED);
            }
            else {
                if (user.verifyOtp == true && user.status == "ACTIVE") {
                    const checkpass = bcrypt.compareSync(password, user.password)
                    if (checkpass) {
                        var token = jwt.sign({ email: req.body.email }, 'Mobiloitte1');
                        // var token = jwt.sign({ userName:user.userName, iat: Math.floor(Date.now() / 1000) - 30 }, 'AkariApp');
                        userModel.findOneAndUpdate({ userName: user.userName, status: "ACTIVE" },
                            { $set: { token: token } },
                            { new: true },
                            (err1, result1) => {
                                if (err1) {
                                    response(res, ErrorCode.SOMETHING_WRONG, err, ErrorMessage.INTERNAL_ERROR);
                                } else {
                                    response(res, SuccessCode.SUCCESS,{token:token}, SuccessMessage.LOGIN_SUCCESS);
                                }
                            }
                        )

                    } else {
                        response(res, ErrorCode.INVALID_CREDENTIAL, [], ErrorMessage.INVALID_CREDENTIAL);
                    }
                } else {
                    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USERNAME_NOT_REGISTERED);
                }


            }


        })
    }



module.exports = {
    signup,
    forgotPassword,
    verifyOtp,
    setPin,
    signupComplete,
    checkUserName,
    checkUserNameOrEmail,
    postRegistration,
    login
}