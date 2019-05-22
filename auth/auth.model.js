const NeDB = require('nedb-promises');
const nodemailer = require('nodemailer-promise');
const crypto = require("crypto");

const DBadmin = {email:process.env.ADMIN_USER, password:process.env.ADMIN_PW, role:'admin'}

const usersDB = NeDB.create('users.db')
      usersDB.on('loadError', (datastore, error) => {console.log(error)    })
      usersDB.ensureIndex({ fieldName: 'email', unique: true });
      usersDB.findOne(DBadmin).then(res=>{ if(!res) usersDB.insert(DBadmin)})

        
const sendEmail = nodemailer.config({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PW
        }
	});
      
async function generateToken() {
    const buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(6, function(err, buffer) {
            if (err) reject("error generating token");
            resolve(buffer);
        });
    });

    const token = buffer.toString('hex');
    
    return token;
}
    

      
module.exports = {
    usersDB,
    sendEmail,
    generateToken
};