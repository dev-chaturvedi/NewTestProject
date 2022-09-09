const { commonResponse: response } = require("../helper/commonResponseHandler");
const { ErrorMessage } = require("../helper/messages");
const { ErrorCode } = require("../helper/statusCodes");
/**
 * loginValidation validation
 **/
exports.loginValidation = function(req, res, next) {
  if (!req.body.email || !req.body.password) {
    response(res, ErrorCode.BAD_REQUEST, [], ErrorMessage.FIELD_REQUIRED);
  } else {
    next();
  }
};
