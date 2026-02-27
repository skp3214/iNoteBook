const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default-access-secret-key";
const fetchuser = async (req, res, next) => {
    // Get the user from the jwt token and add id to req id
    const token=req.header('authtoken');
    if(!token){
        return res.status(401).send({error:"please authenticate using a valid token"})
    }
    try{
        const data=jwt.verify(token,ACCESS_TOKEN_SECRET);
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).send({error:"Session invalid. Please login again."});
        }

        const sessionValid = await authService.verifySession(data.user.id, refreshToken);
        if (!sessionValid) {
            return res.status(401).send({error:"Session invalid. Please login again."});
        }

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