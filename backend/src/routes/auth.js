const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });
        if (password.length < 4) return res.status(400).json({ message: "Password too short" });

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ message: "Email already registered" });

        const passwordHash = await User.hashPassword(password);
        const user = await User.create({ email, passwordHash });
        const token = signToken(user._id);
        res.status(201).json({ token, user: user.toPublic() });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const valid = await user.comparePassword(password);
        if (!valid) return res.status(401).json({ message: "Invalid credentials" });

        const token = signToken(user._id);
        res.json({ token, user: user.toPublic() });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
