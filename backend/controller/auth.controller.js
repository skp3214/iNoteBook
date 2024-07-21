const authService = require('../services/auth.service');

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
        res.status(200).json({ success, authtoken: result.authtoken });
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
        return res.json({ success, authtoken: result.authtoken });
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
