const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userDao = require('../dao/auth.dao');
const emailService = require('./email.service');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "default-access-secret-key";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET || "default-refresh-secret-key";
const ACCESS_TOKEN_EXPIRY = '10m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const signAccessToken = (userId) => {
    const payload = { user: { id: userId } };
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
};

const signRefreshToken = (userId) => {
    const payload = { user: { id: userId }, type: 'refresh' };
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

const issueAndStoreTokens = async (userId) => {
    const accessToken = signAccessToken(userId);
    const refreshToken = signRefreshToken(userId);

    await userDao.updateUser(userId, {
        refreshTokenHash: hashToken(refreshToken),
        refreshTokenExpires: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });

    return { accessToken, refreshToken };
};

const verifyRefreshTokenPayload = (refreshToken) => {
    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    if (!payload?.user?.id || payload?.type !== 'refresh') {
        throw new Error('Invalid refresh token payload');
    }
    return payload;
};

exports.createUser = async (name, email, password) => {
    let userExist = true;
    let user = await userDao.findUserByEmail(email);
    if (user) {
        return { userExist };
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    user = await userDao.createUser({ name, email, password: secPass });
    const tokens = await issueAndStoreTokens(user.id);
    return { userExist: false, ...tokens };
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
    return issueAndStoreTokens(user.id);
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
        refreshTokenHash: undefined,
        refreshTokenExpires: undefined,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
    });

    return { success: true, message: 'Password reset successful' };
};

exports.refreshAccessToken = async (refreshToken) => {
    const payload = verifyRefreshTokenPayload(refreshToken);
    const user = await userDao.findUserByIdWithSecrets(payload.user.id);
    if (!user || !user.refreshTokenHash || !user.refreshTokenExpires) {
        return null;
    }

    const isExpired = new Date(user.refreshTokenExpires).getTime() < Date.now();
    const isMatch = user.refreshTokenHash === hashToken(refreshToken);
    if (!isMatch || isExpired) {
        return null;
    }

    return issueAndStoreTokens(user.id);
};

exports.revokeSessionByUserId = async (userId) => {
    if (!userId) return;
    await userDao.updateUser(userId, {
        refreshTokenHash: undefined,
        refreshTokenExpires: undefined
    });
};

exports.revokeSessionByRefreshToken = async (refreshToken) => {
    try {
        const payload = verifyRefreshTokenPayload(refreshToken);
        await exports.revokeSessionByUserId(payload.user.id);
    } catch (err) {
        return;
    }
};

exports.verifySession = async (userId, refreshToken) => {
    try {
        const payload = verifyRefreshTokenPayload(refreshToken);
        if (payload.user.id !== userId) {
            return false;
        }

        const user = await userDao.findUserByIdWithSecrets(userId);
        if (!user || !user.refreshTokenHash || !user.refreshTokenExpires) {
            return false;
        }

        const isExpired = new Date(user.refreshTokenExpires).getTime() < Date.now();
        const isMatch = user.refreshTokenHash === hashToken(refreshToken);
        return !isExpired && isMatch;
    } catch (err) {
        return false;
    }
};
