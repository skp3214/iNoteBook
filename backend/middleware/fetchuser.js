const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";
const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req id
    const token=req.header('authtoken');
    if(!token){
        return res.status(401).send({error:"please authenticate using a valid token"})
    }
    try{
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next()
    }
    catch(err){
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({error:"Token expired, please login again", expired: true});
        }
        return res.status(401).send({error:"Invalid token"})
    }
}
module.exports = fetchuser;