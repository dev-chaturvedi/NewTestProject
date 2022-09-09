const mailer = require('nodemailer');
const fs = require("file-system")
const twilio = require('twilio')
const cloudinary = require('cloudinary');

var accountSid ='ACf786a64203b2524f8ee2878ee632bbe7';
var authToken = '0f53e378507e1543cd5e2ddfcf5389a1';
const client = require('twilio')(accountSid, authToken);


cloudinary.config({
  cloud_name: "dl2d0v5hy",
  api_key: "841684319665911",
  api_secret: "kG5j1sXJT3eeNAp5CtpZgIdfQzM"
  });




module.exports ={
    /**
    * Function Name : getOTP
    * Description   : Genrate random number 
    *
    *
    * @return otp
    */
    getOTP :function () {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
},
/**
    * Function Name : sendSms
    * Description   : Send Sms with SNS (AWS)
    *
    *
    * @return otp
    */
sendSms : function (message, mobile, callback) {
    sender.sendSms(message, 'akari', false, mobile)
        .then(function (response) {
            callback(null, response)
        })
        .catch(function (err) {
            callback(null, err)
    })
},


    /**
    * Function Name : imageUploadCloudinary
    * Description   : upload image base-64
    *
    *
    * @return secure_url
    */
   uploadImg: (base64, callback) => {
    cloudinary.v2.uploader.upload(base64, (err, result1) => {
        console.log("=====================", err, result1);
        //   if(err){
        //     console.log(">>>",err)
        //   }
        if (result1) {
            callback(null, result1.secure_url)
        }
        else {
            callback(true, null);
        }
    })
},

  imageUploadCloudinary :(pic, callback) => {
    cloudinary.v2.uploader.upload(pic, (error, result) => {
        if (error) {
            console.log("error in upload", error)
            callback(error, null)
        }
        else {
           callback(null, result.secure_url)
        }
    })
},




/**
    * Function Name : sendSMS
    * Description   : send forgot password otp to registered mobilenumber
    *
    *
    * @return otp
    */
   sendOtp :(mobileNumber,otp,callMe)=>{
   client.messages.create({
       body: `Dear Customer,
       Thank you for using Akari systems App OTP verification
       Your forgot password OTP: ${otp}  
       Thanks  &  Regards
       Team Akari`,
       to: mobileNumber,  // Text this number
    //    from:'+18043768654' ,
       from:'+18555728559' // From a valid Twilio number
   },(smsErr,smsResult)=>{
       if(smsErr){
       callMe(smsErr,null)
       }
       else {
        callMe(null,smsResult)   
       }

    // callMe(null,'success')  
   })
   },
  

/**
    * Function Name : sendMail
    * Description   : Send mail to registered Mail 
    *
    *
    * @return mailBody response
    */
sendMail :function (email, subject,name,link, callback) {
    let html = `<html lang="en">
                      <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta name="description" content="">
                        <meta name="author" content="">
                        <title>Vendor & Users</title>
                      </head>
                      <body style="margin: 0px; padding: 0px; background-color: #eeeeee;">
                     
                        <div style="width:600px; margin:20px auto; background:#fff; font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
                      <div>
                          <table style="width: 100%; border: 1px solid #ccc;" cellpadding="0" cellspacing="0">
                            <tbody>
                            <tr style="margin:0;padding:0">
                            <td bgcolor="#f1f1f1" height="100" style="text-align:center;background:#f1f1f1">
                                <img height="80" width="100" src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1572953948/hhd4nx68emfls1xz89ul.png" alt="Email register" class="">
                            </td>
                        </tr>
                                <tr>
                                  <td style="padding: 50px 15px 10px;">Dear ${name}, </td>
                                </tr>
                                <tr>
                                <td style="padding: 10px 15px 10px;">Thank you for using Akari App </td>
                              </tr>
                              
                                <tr>
                                <td style="padding: 10px 15px 10px;">Click here to reset Password: <a href= ${link}>Click Here</a> </td>
                                </tr>
                               
                                       
                                <tr>
                                  <td style="padding: 25px 15px 20px;">
                                    Thanks &amp; Regards <br> Team 
                                    Akari
                                    </td>
                               </tr>
                               <tr>
                             </tr>
                            </tbody>
                          </table>
                          </div>
                        </div>
                      </body>
                     </html>`
    const mailBody = {
        from: "<do_not_reply@gmail.com>",
        to: email,
        subject: subject,
        html: html
    };
    mailer.createTransport({
        service: 'GMAIL',
        auth: {
            user: global.gConfig.user,
            pass: global.gConfig.pass
        },
        port: 465,
        host: 'smtp.gmail.com'

    }).sendMail(mailBody, callback)
},



//helper>commonFunction.js
/**
    * Function Name : readAndWriteFile
    * Description   : read and write/upload the file to the project
    *
    *
    * @return otp
    */
    readAndWriteFile:(singleImg, newPath)=> {
    fs.readFile(singleImg.path, (err, data) => {
        if (err) {
            return res.send({ responseCode: 500, responseMessage: "Internal server error" })
        }
        else {
            fs.writeFile(newPath, data, (err, result) => {
                console.log(">>>>>>549", newPath, data)
                if (err)
                    console.log('ERRRRRR!! :' + err);
                else {
                    console.log('Fitxer: ' + singleImg.originalFilename + ' - ' + newPath);
                }
            })
        }

    })
}

}
