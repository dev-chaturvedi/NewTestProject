const userModel = require('../model/userModel');
const userKyc = require('../../akari/model/kycModel')
const { commonResponse: response } = require('../helper/commonResponseHandler')
const { ErrorMessage } = require('../helper/messages')
const { SuccessMessage } = require('../helper/messages')
const { ErrorCode } = require('../helper/statusCodes')
const { SuccessCode } = require('../helper/statusCodes')
const commonFunction = require('../helper/commonFunction')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const salt = bcrypt.genSaltSync(10);

var multiparty = require("multiparty");
// const salt = bcrypt.genSaltSync(10);

module.exports = {
    /**
     * Function Name : uploadKyc
     * Description   : user upload KYC
     *
     * @return response
     */
    uploadKyc: (req, res) => {
        try {
            userKycModel.findOne(
                { fullLegalName: req.body.userName },
                (error, kycData) => {
                    if (error) {
                        response(res, ErrorCode.SOMETHING_WRONG,[], ErrorMessage.SOMETHING_WRONG);
                    } else if (!kycData) {
                        let form = new multiparty.Form();
                        form.parse(req, (error, field, files) => {
                            console.log("the uploading information....", error, field, files);
                            if (error) {
                                response( res, ErrorCode.SOMETHING_WRONG,[], ErrorMessage.SOMETHING_WRONG);
                            }
                            let body = new userKycModel(field);
                            var imgArray = files.selfie;
                            var photoarray = new Array();
                            for (var i = 0; i < imgArray.length; i++) {
                                var newPath = "../public/upload";
                                var singleImg = imgArray[i];
                                newPath += Date.now() + "_" + singleImg.originalFilename;
                                photoarray.push(newPath);
                                var singleImg = imgArray[i];
                                newPath += Date.now() + "_" + singleImg.originalFilename;
                                readAndWriteFile(singleImg, newPath);
                            }
                            commonFunction.readAndWriteFile(files.front[0], "../public/upload" + "-" + files.front[0].originalFilename
                            );
                            commonFunction.readAndWriteFile( files.back[0], "../public/upload" + "-" + files.back[0].originalFilename
                            );
                            body.selfie = photoarray;
                            body.identificationDocument = {
                                name:field.identificationDocument.join(),
                                front: "../public/upload" + "-" + files.front[0].originalFilename,
                                back: "../public/upload" + "-" + files.back[0].originalFilename
                            };
                            body.fullLegalName = field.fullLegalName.join();
                            body.dateOfBirth = field.dateOfBirth.join();
                            body.nationality = field.nationality.join();
                            body.homeAddress = {
                                addressLine: field.addressLine.join(),
                                other: field.other.join(),
                                city: field.city.join(),
                                state: field.state.join(),
                                country: field.country.join()
                            };
                            console.log("the save before status...." + body);

                            body.save((error, saveData) => {
                                if (error) {
                                    response( res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG);
                                } else {
                                    response(res, SuccessCode.SUCCESS, [saveData], SuccessMessage.KYC_UPLOADED );
                                }
                            });
                        });
                    } else {
                        response( res, ErrorCode.ALREADY_EXIST,[kycData], ErrorMessage.KYC_ALREADY_UPLOADED  );
                    }
                }
            );
        } catch {
            response( res, ErrorCode.SOMETHING_WRONG, [], ErrorMessage.SOMETHING_WRONG );
        }
    },



  /**
     * Function Name : viewKyc
     * Description   : view KYC images
     *
     * @return response
     */
    viewKyc:(req,res)=>{
        try{
        userKycModel.findOne({_id:req.headers.kycid,status:{$ne:"DELETE"}},(error,kycData)=>{
            if(error){
                response(res, ErrorCode.SOMETHING_WRONG,[], ErrorMessage.SOMETHING_WRONG); 
            }
            else if(!kycData){
                response(res, ErrorCode.NOT_FOUND, [], ErrorMessage.NOT_FOUND);
            }
            else{
                response(res, SuccessCode.SUCCESS, [kycData], SuccessMessage.DETAIL_GET);  
            }
        })
        }catch{
            response( res, ErrorCode.SOMETHING_WRONG,[], ErrorMessage.SOMETHING_WRONG ); 
        }
    }
};
