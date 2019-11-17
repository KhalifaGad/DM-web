import nodemailer from 'nodemailer'
import ejs from 'ejs'

const mailer = async (name, code, email, isStore) => {

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        port: 25,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    //client id: 134971666526-c8r2b1ctp18sdc4uc07mciq0ed303eg2.apps.googleusercontent.com
    //client token: SfKbgJJBztyylPArfeHHFZKe

    ejs.renderFile(__dirname+'/../../asset/mail/mail.ejs', { name, code }, (err, data)=> {
        if(err) {
            console.log(err)
        }else {
            const mailOptions = {
                from: `"Drug1Market" <${process.env.EMAIL}>` ,
                to: email,
                subject: 'Account Verification',
                html: data
            }
            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Message sent: ' + info.response);
                }
            });
        }
    })
}

export {
    mailer as
    default
}

/*
html: `<h3>Hi ${name},</h3><br>
            <h5>Welcome to DrugMarket platform</h5>
            <br><br>
            <span>Please click on</span> 
            <a href='http://localhost:4000/?query={storeVerification(code:"${code}")}'>
            this link to verify your account
            </a>`
*/
