const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userDao = require('../dao/auth.dao');
const JWT_SECRET = "Sachinisagood$boy";

exports.createUser = async (name, email, password) => {
    let userExist = true;
    let user = await userDao.findUserByEmail(email);
    if (user) {
        return { userExist };
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    user = await userDao.createUser({ name, email, password: secPass });
    const data = {
        user: {
            id: user.id,
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    return { userExist: false, authtoken };
};

exports.loginUser = async (email, password) => {
    let user = await userDao.findUserByEmail(email);
    if (!user) {
        return null;
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        return null;
    }
    const payload = {
        user: {
            id: user.id
        }
    }
    const authtoken = jwt.sign(payload, JWT_SECRET);
    return { authtoken };
};

exports.getUserById = async (userId) => {
    const user = await userDao.findUserById(userId);
    return user;
};
