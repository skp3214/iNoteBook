const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userDao = require('../dao/auth.dao');
const emailService = require('./email.service');
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

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

exports.forgotPassword = async (email) => {
    const user = await userDao.findUserByEmail(email);
    if (!user) {
        return { success: false, message: 'User not found' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await userDao.updateUser(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpiry
    });

    // Try to send email
    const emailResult = await emailService.sendPasswordResetEmail(user.email, resetToken);
    
    if (!emailResult.success) {
        console.error('Email failed:', emailResult.error);
        // In development, return token for testing
        if (process.env.NODE_ENV === 'development') {
            return { 
                success: true, 
                message: 'Email service unavailable. Reset token (dev only)', 
                resetToken 
            };
        }
        return { success: false, message: 'Failed to send reset email. Please try again later.' };
    }

    return { success: true, message: 'Password reset email sent successfully' };
};

exports.resetPassword = async (token, newPassword) => {
    const user = await userDao.findUserByResetToken(token);
    if (!user || user.resetPasswordExpires < Date.now()) {
        return { success: false, message: 'Invalid or expired reset token' };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await userDao.updateUser(user._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
    });

    return { success: true, message: 'Password reset successful' };
};
