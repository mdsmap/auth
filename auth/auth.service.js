const { usersDB, sendEmail, generateToken } = require('./auth.model.js'); 
const jwt = require('jsonwebtoken');

module.exports = {
    register,
    verify,
    sign_in,
    forgot_password,
    reset_password,
    getAll,
    getUser
};

async function register(user) {
    if(!user.email || !user.password) throw new Error("email or password missing");
    if(user.role) throw new Error("role property not allowed on register");
    user.verifyToken = await generateToken();
    await usersDB.insert(user);

    sendEmail({
        to: user.email,
        subject: "VerifyToken",
        text: user.verifyToken
    })
    return "success"
}

async function verify(user) {
    if(!user.email || !user.password || !user.verifyToken) throw new Error("Missing parameters");
    let dbUser = await usersDB.findOne(user);
    if(!dbUser) throw new Error("Wrong parameters");

    await usersDB.update({_id: dbUser._id}, { $unset: { verifyToken: true } });

    return "success"
}

async function sign_in(user) {
    if(!user.email || !user.password) throw new Error("email or password missing");
    
    let dbUser = await usersDB.findOne(user);
    if(!dbUser) throw new Error("email or password wrong");
    if(dbUser.verifyToken) throw new Error("User not verified");
    if(dbUser.resetToken) throw new Error("Password reset");

    const token = jwt.sign({ sub: dbUser._id , role: dbUser.role}, process.env.JWT_SECRET);
    const { password, _id, ...userProfile } = dbUser;
    return { userProfile, token, "token_type":"bearer" };
}

async function forgot_password(user) {
    let dbUser = await usersDB.findOne({email:user.email});
    if(!dbUser) throw new Error("Wrong email");
        dbUser.resetToken = await generateToken();
        
    await usersDB.update({_id: dbUser._id}, { $set: { resetToken: dbUser.resetToken } });

    sendEmail({
        to: dbUser.email,
        subject: 'ResetToken',
        text: dbUser.resetToken
    })

    return "Reset Token send"
    
}

async function reset_password(user) {
    if(!user.email || !user.newPassword || !user.resetToken) throw new Error("Missing parameters");
    let dbUser = await usersDB.findOne({email: user.email, resetToken: user.resetToken});
    if(!dbUser) throw new Error("Wrong parameters");

    await usersDB.update({_id: dbUser._id}, { 
        $set: { password: user.newPassword },
        $unset: { resetToken: true } 
    });

    return "Password reset"
}

async function getAll() {
    let dbUsers = await usersDB.find();
    const dbUsers_limited = dbUsers.map(e=>{
        const {_id, verifyToken, ...rest} = e
        return rest;
    })
    
    return dbUsers_limited;
    
}

async function getUser(userid) {
    let dbUser = await usersDB.findOne({_id:userid});
    return dbUser;
}