const authService = require('../services/auth.service');
const {validationResult}=require('express-validator');

const getRefreshCookieOptions = () => {
    const isProd = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    };
};

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie('refreshToken', {
        ...getRefreshCookieOptions(),
        maxAge: undefined,
        expires: new Date(0)
    });
};

exports.createUser = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: 'Validation failed',
            data: errors.array()
        });
    }
    try {
        const { name, email, password } = req.body;
        const result = await authService.createUser(name, email, password);
        if (result.userExist) {
            return res.status(400).json({ userExist: true });
        }
        success = true;
        setRefreshTokenCookie(res, result.refreshToken);
        res.status(200).json({ success, authtoken: result.accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.loginUser = async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: 'Validation failed',
            data: errors.array()
        });
    }

    const { email, password } = req.body;

    try {
        const result = await authService.loginUser(email, password);
        if (!result) {
            success = false;
            return res.status(400).json({ success, error: "Try to login with correct credentials." });
        }
        success = true;
        setRefreshTokenCookie(res, result.refreshToken);
        return res.json({ success, authtoken: result.accessToken });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await authService.getUserById(userId);
        res.send(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.forgotPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: 'Validation failed',
            data: errors.array()
        });
    }

    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        
        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message });
        }

        res.json({ 
            success: true, 
            message: result.message
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resetPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: 'Validation failed',
            data: errors.array()
        });
    }

    try {
        const { token, password } = req.body;
        const result = await authService.resetPassword(token, password);
        
        if (!result.success) {
            return res.status(400).json({ success: false, message: result.message });
        }

        res.json({ success: true, message: result.message });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token missing' });
        }

        const tokens = await authService.refreshAccessToken(refreshToken);
        if (!tokens) {
            clearRefreshTokenCookie(res);
            return res.status(401).json({ error: 'Invalid or expired refresh token' });
        }

        setRefreshTokenCookie(res, tokens.refreshToken);
        return res.status(200).json({ success: true, authtoken: tokens.accessToken });
    } catch (err) {
        console.log(err);
        clearRefreshTokenCookie(res);
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            await authService.revokeSessionByRefreshToken(refreshToken);
        }
        clearRefreshTokenCookie(res);
        return res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.log(err);
        clearRefreshTokenCookie(res);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
