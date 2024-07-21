const User = require('../models/User');

exports.findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

exports.createUser = async (userData) => {
    return await User.create(userData);
};

exports.findUserById = async (userId) => {
    return await User.findById(userId).select("-password");
};
