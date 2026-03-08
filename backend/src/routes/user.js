const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/user/profile
router.get("/profile", auth, async (req, res) => {
    res.json({ user: req.user.toPublic() });
});

// PUT /api/user/profile — update username and avatar
router.put("/profile", auth, async (req, res) => {
    try {
        const { username, avatar } = req.body;
        if (username) req.user.username = username;
        if (avatar) req.user.avatar = avatar;
        await req.user.save();
        res.json({ user: req.user.toPublic() });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
