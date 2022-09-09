const userModel = require("../model/userModel");
const faqModel = require('../model/faqModel');
const { commonResponse: response } = require("../helper/commonResponseHandler");
const { ErrorMessage } = require("../helper/messages");
const { SuccessMessage } = require("../helper/messages");
const { ErrorCode } = require("../helper/statusCodes");
const { SuccessCode } = require("../helper/statusCodes");
const commonFunction = require("../helper/commonFunction");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const salt = bcrypt.genSaltSync(10);

/**
 * Function Name : login
 * Description   : Admin login
 *
 * @return response
 */
const login = (req, res) => {
  try {
    userModel.findOne(
      { email: req.body.email, status: "ACTIVE", userType: "ADMIN" },
      (error, adminData) => {
        if (error) {
          response(res,ErrorCode.SOMETHING_WRONG,[],ErrorMessage.SOMETHING_WRONG);
        } else if (!adminData) {
          response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.EMAIL_NOT_REGISTERED);
        } else {
          const check = bcrypt.compareSync(
            req.body.password,
            adminData.password
          );
          var token = jwt.sign(
            { userId: adminData._id, iat: Math.floor(Date.now() / 1000) - 30 }, "akari");
          if (check) {
            result = {
              userId: adminData._id,
              token: token,
              fullName: adminData.fullName,

              email: adminData.email,
              mobileNumber: adminData.mobileNumber
            };

            response(res,SuccessCode.SUCCESS, [result],SuccessMessage.LOGIN_SUCCESS );
          } else { 
              response( res,ErrorCode.INVALID_CREDENTIAL,[], ErrorMessage.INVALID_CREDENTIAL);
          }
        }
      }
    );
  } catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
  }
}


/**
 * Function Name : getProfile
 * Description   : Admin getProfile
 *
 * @return response
 */
const getProfile = (req, res) => {
    try {
    userModel.find({ _id: req.headers.userid, status: "ACTIVE", userType: "ADMIN" }, (error, adminData) => {
    if (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    } else if (!adminData) {
      console.log("hhhhhhhh",adminData)
    response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
    } else {
    response(res, SuccessCode.SUCCESS, [adminData], SuccessMessage.DETAIL_GET);
    }
    })
    }
    catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    
    }
    }

  /**
    * Function Name :forgotPassword
    * Description   :forgot password
    *
    * @return response
    */

const forgotPassword = (req, res) => {
    try {
        userModel.findOne({ email: req.body.email ,userType:'ADMIN'}, (error, userDetails) => {
          console.log(".......153",error,userDetails)
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            }
            else if(!userDetails){
              response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.EMAIL_NOT_REGISTERED);
            } else {
                var link = `global.gConfig.url/${userDetails._id}/`;
                // userModel.findOneAndUpdate({ email: req.body.email }, { $set: { otp: otp } }, { new: true }, (error, otpUpdate) => {
                //     if (error) {
  
                //         response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                //     } else {
                        commonFunction.sendMail(req.body.email, 'Forgot Password', userDetails.fullName, link, (error, sendMail) => {
                          console.log("the mail message....",error,sendMail)
                            if (error) {
                                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                            } else {
                                response(res, SuccessCode.SUCCESS, [userDetails._id], SuccessMessage.LINK_SEND);
                            }
                        })
                //     }
                // })
            }
        })
    } catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
  }



  /**
    * Function Name :resetPassword
    * Description   :Updated password
    *
    * @return response
    */
   const resetPassword = (req, res) => {
    try {
        userModel.findOne({ _id: req.body.userId ,userType:"ADMIN"}, (error, userDetails) => {
            if (error) {
                response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
            } else if (userDetails) {
                req.body.password = bcrypt.hashSync(req.body.password, salt)
                userModel.findOneAndUpdate({ _id: userDetails._id }, { $set: { password: req.body.password } }, { multi: true }, (error, otpUpdate) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                    } else {
                        response(res, SuccessCode.SUCCESS, [], SuccessMessage.PASSWORD_UPDATE);
                    }
                })
            } else {
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.USER_FOUND);
            }
        })
    } catch (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
  
  };

  /**
    * Function Name :changePassword
    * Description   :change password
    *
    * @return response
    */

const changePassword =(req, res) => {
  try {
    if (
      !req.body.adminId ||
      !req.body.newPassword ||
      !req.body.confirmPassword ||
      !req.body.oldPassword
    ) {
      response(res, ErrorCode.UNAUTHORIZED, ErrorMessage. PARAMETER_MISSING);
    } else {
      userModel.findOne(
        { _id: req.body.adminId, status: "ACTIVE" },
        (err, result1) => {
          if (err) {
            response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage. INTERNAL_ERROR);
          } else if (!result1) {
            response(res, ErrorCode.NOT_FOUND, ErrorMessage. ADMIN_NOT_FOUND);
          } else {
            var check = bcrypt.compareSync(req.body.oldPassword, result1.password)
            if (check) {
              if (req.body.newPassword == req.body.confirmPassword) {
                var hashPassword = bcrypt.hashSync(req.body.confirmPassword);
                userModel.findOneAndUpdate(
                  { _id: req.body.adminId, status: "ACTIVE" },
                  { $set: { password: hashPassword } },
                  { new: true },
                  (err, result2) => {
                    if (err) {
                      response(res, ErrorCode.SOMETHING_WRONG, ErrorMessage. INTERNAL_ERROR);
                    } else if (!result2) {
                      response(res, ErrorCode.NOT_FOUND, ErrorMessage. ADMIN_NOT_FOUND);

                    } else {
                      console.log("success in resetPassword", result2);
                      var result = { _id: result2._id };
                      response(res, SuccessCode.SUCCESS, SuccessMessage.CHANGE_PASSWORD,result);
                    }
                  }
                );
              } else {
                response(res, ErrorCode.NOT_FOUND, [userDetails._id], ErrorMessage. PASSWORD_NOT_MATCHED);
              }
            } else {
              console.log("old password not matched")
              response(res, ErrorCode.NOT_FOUND, ErrorMessage. PASSWORD_NOT_MATCHED);
            }
          }
        }
      );
    }
  } catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
  }
}

/**
* Function Name : addFaq
* Description   : add Faq by admin
*
* @return response
*/

const addFaq = (req, res) => {
  try {
    var query = { title: req.body.title, status: "ACTIVE" }
    faqModel.findOne(query, (error, result) => {
      if (error)
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
      else if (result) {
        console.log("kkkkkkkk", result)
        response(res, ErrorCode.ALREADY_EXIST, [], ErrorMessage.FAQ_EXIST);
      }
      else {
        new faqModel(req.body).save((err, saveResult) => {
          if (err) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
          }
          else {
            response(res, SuccessCode.SUCCESS, saveResult, SuccessMessage.FAQ_ADDED);
          }
        })
      }
    })
  }
  catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
}
}

/**
* Function Name : editFaq
* Description   : edit Faq by admin
*
* @return response
*/
const editFaq = (req, res) => {
  faqModel.findOne({ '_id': req.body.faqId, status: "ACTIVE" }, (err, success) => {
    if (err) {
      response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
    }
    else if (!success) {
      response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
    }
    else {
      faqModel.findByIdAndUpdate({ '_id': req.body.faqId, status: "ACTIVE" }, req.body, { new: true }, (error, update_result) => {
        if (error) {
          responseHandler.sendResponseWithData(res, httpResponseCode.INTERNAL_SERVER_ERROR, httpResponseMessage.INTERNAL_SERVER_ERROR, err);
        }
        else {
          response(res, SuccessCode.SUCCESS, update_result, SuccessMessage.FAQ_UPDATED);
        }
      })
    }
  })
}
/**
* Function Name : deleteFaq
* Description   : delete Faq by admin
*
* @return response
*/

const deleteFaq = (req, res) => {
  try {
    faqModel.findOne({ '_id': req.body.faqId, status: "ACTIVE" }, (err, success) => {
      if (err) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
      }
      else if (!success) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      }
      else {
        faqModel.findOneAndUpdate({ '_id': req.body.faqId, status: "ACTIVE" }, { $set: { status: req.body.status } }, { new: true }, (err, result) => {
          if (err) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
          }
          else {
            response(res, SuccessCode.SUCCESS, result, SuccessMessage.FAQ_DELETE);

          }
        })
      }
    })
  }
  catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
}
}

/**
 * Function Name : viewFaq
 * Description   : admin can view particular Faq ,can see list,can search
 *
 * @return response
 */



const viewFaq = (req, res) => {
  var query = {}, options;
  try {

    if (req.body.faqId) {
      query.$and = [{ _id: req.body.faqId }, { status: { $ne: "DELETE" } }]
    }
    else if (req.body.title) {
      query.$and = [{ title: { $regex: "^" + req.body.title, $options: 'i' } }, { status: { $ne: "DELETE" } }]
    }
    else {
      query.$and = [{ status: { $ne: "DELETE" } }]
    }
    options = {
      page: req.body.pageNumber || 1,
      limit: req.body.limit || 5,
      sort: {
        createdAt: -1
      },

    }
    faqModel.paginate(query, options, (error, result) => {
      if (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
      } else if (result.docs.length == 0) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      } else {
        return res.send({ responseCode: 200, responseMessage: "Faq found successfully", result: result })
      }
    })

  }catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
}
}


/**
 * Function Name : getUser
 * Description   : user list 
 *
 * @return response
 */

const getUser = (req, res) => {

  var query = {}, options;
  try {

    if (req.body.userId) {
      query.$and = [{ _id: req.body.userId, userType: "USER" }, { status: { $ne: "DELETE" } }]
    }
    else if (req.body.mobileNumber) {
      query.$and = [{ mobileNumber: { $regex: "^" + req.body.mobileNumber, $options: 'i' } }, { status: { $ne: "DELETE" }, userType: "USER" }]
    }
    else if (req.body.email) {
      query.$and = [{ email: { $regex: "^" + req.body.email, $options: 'i' } }, { status: { $ne: "DELETE" }, userType: "USER" }]
    }
    else {
      query.$and = [{ status: { $ne: "DELETE" }, userType: "USER" }]
    }
    options = {
      page: req.body.pageNumber || 1,
      limit: req.body.limit || 5,
      sort: {
        createdAt: -1
      },

    }
    userModel.paginate(query, options, (error, userData) => {
      if (error) {
        response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG)
      } else if (userData.docs.length == 0) {
        response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
      } else {
        return res.send({ responseCode: 200, responseMessage: "User found successfully", result: userData })
      }
    })

  } catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
}
}

/**
* Function Name :ACTIVE/BLOCK User
* Description   :Active and Block status in user Management
*
* @return response
*/
const userManagement = (req, res) => {
  try {
    if (req.body.status == "BLOCK") {
      userModel.findOneAndUpdate({ _id: req.body.userId, status: "ACTIVE" }, { $set: { status: "BLOCK" } },
        { new: true }, (error, userData) => {
          if (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
          } else if (!userData) {
            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
          } else {
            response(res, SuccessCode.SUCCESS, [userData], SuccessMessage.BLOCK_SUCCESS)
          }
        })
    } else if (req.body.status == "DELETE") {
      userModel.findOneAndUpdate({ _id: req.body.userId, status: "ACTIVE" }, { $set: { status: "DELETE" } },
        { new: true }, (error, userData) => {
          if (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
          } else if (!userData) {
            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
          } else {
            response(res, SuccessCode.SUCCESS, [userData], SuccessMessage.DELETE_SUCCESS)
          }
        })
    }
    else {
      userModel.findOneAndUpdate({ _id: req.body.userId,status: "BLOCK" }, { $set: { status: "ACTIVE" } },
       { new: true },(error, userData) => {
          if (error) {
            response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
          } else if (!userData) {
            response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
          } else {
            response(res, SuccessCode.SUCCESS, [userData], SuccessMessage.ACTIVE_SUCCESS)
          }
        })
    }




  }
  catch (error) {
    response(res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);

  }

}
    
module.exports = {
  login,
  getProfile,
  forgotPassword,
  resetPassword ,
  changePassword, 
  addFaq,
  editFaq,
  deleteFaq,
  viewFaq,
  getUser,
  userManagement
};
