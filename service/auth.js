const jwt = require('jsonwebtoken');
const secret = "Abhishek$123@321"

function setUser(user){
    const payload = {
        _id : user._id,
        email : user.email,
        role: user.role,
    }
    return jwt.sign(payload, secret);
}

function getUser(token){
    if(!token) return null;
    try{
        return jwt.verify(token, secret);
    }
    catch(err){
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}