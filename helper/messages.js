/** 
 * @description All the Error messages that needed to be sent to Admin or App
 * @type {Object}
*/
module.exports.ErrorMessage = Object.freeze({
    INVALID_TOKEN: 'Unauthorized User',
    INTERNAL_ERROR : 'Internal Server Error',
    PARAMETER_MISSING : 'Parameter is missing',
    INVALID_CREDENTIAL:'Invalid credential',
    INVALID_OTP: 'Invalid OTP',
    SOMETHING_WRONG:'Something went wrong!',
    EMAIL_NOT_REGISTERED:'Email not registered',
    USERNAME_NOT_REGISTERED:'User Name not Registered',
    RESET_PASSWORD_EXPIRED:'Token has been expire',
    WRONG_PASSWORD:'Please enter valid password',
    EMAIL_EXIST:'Email already exist',
    NOT_FOUND:'Data not found',
    USER_FOUND:'User not found',
    MOB_NOT_FOUND:'Mobile Number not found',
    PASSWORD_NOT_MATCHED:' password not matched',
    ADMIN_NOT_FOUND:'admin not found',
    MOBILE_EXIST:'Mobile number already exist',
    USERNAME_EXIST:'User name already exist',
    USER_ID:'User Id required',
    BLOCKED_BY_ADMIN:'You are blocked by admin please contact to Admin',
    DELETED_BY_ADMIN:'Your account deleted, please contact to Admin',
    FIELD_REQUIRED:'Fields are required',
    OLD_PASSWORD:'Old password didnot macth',
    INCORRECT_JWT:'Invalid JWT token.',
    FORBIDDEN:'Error in sending email',
    SIGNUP: 'Number is already Exist',
    FAQ_EXIST:'Faq already exist'
   
});

/** 
 * @description All the Success messages that needed to be sent to App or Admin
 * @type {Object}
*/
module.exports.SuccessMessage = Object.freeze({
    LOGIN_SUCCESS: 'You have successfully login.',
    SIGNUP_SUCCESS: 'You have successfully signup',
    FORGET_SUCCESS: 'Password link has been send successfully',
    RESET_SUCCESS:'Password changed successfully',
    USER_LIST_FETCH:'User list fetch successfully',
    AUTHORIZATION:'Authorized User',
    ACCOUNT_CREATION: 'Your account has been created successfully',
    OTP_SEND: 'Otp send to your registered Email Id',
    LINK_SEND: 'Link sent to your registered Email Id',
    OTP_MOB_SEND:'OTP send to your registered mobileNumber',
    CHANGE_PASSWORD:'Password changed successfully',
    DETAIL_GET:"Detail get successfully",
    PROFILE_DETAILS:"Your profile detail updated sucessfully",
    FAQ_ADDED:"Faq added sucessfully",
    FAQ_UPDATED:"Faq updated successfully",
    FAQ_DELETE:"Faq deleted successfully",
    BLOCK_SUCCESS:"Blocked successfully",
    DELETE_SUCCESS:"Delete successfully",
    ACTIVE_SUCCESS:"Active successfully",
    REGISTER_SUCCESS:"The user is successfully registered",
    POST_REGISTER:"You can proceed further for post registration",
    VERIFY_OTP: 'OTP verified successfully',
    PIN_SET:"Pin set successfully",
    PASSWORD_UPDATE:"Password updated successfully",
    DETAIL_GET:"Detail get successfully",
    PROFILE_DETAILS:"Your profile detail updated sucessfully",
});
