const router = require("express").Router();
const auth = require("../middleware/auth");

const DAILY_POOL_IDS = ["d1", "d2", "d3", "d4"];

// GET /api/daily — get today's daily question index
router.get("/", auth, (req, res) => {
    const idx = Math.floor(Date.now() / 86400000) % DAILY_POOL_IDS.length;
    res.json({ qId: DAILY_POOL_IDS[idx], done: req.user.dailyDone });
});

// POST /api/daily/complete — mark daily as done
router.post("/complete", auth, async (req, res) => {
    try {
        const { qId, xp } = req.body;
        const user = req.user;

        if (user.dailyDone) return res.json({ user: user.toPublic() });

        const now = new Date();
        const lastDate = user.lastDailyDate ? new Date(user.lastDailyDate) : null;
        if (lastDate && (now - lastDate) < 172800000) {
            user.streak += 1;
        } else {
            user.streak = 1;
        }
        user.dailyDone = true;
        user.lastDailyDate = now.toISOString();
        user.xp += xp || 100;

        await user.save();
        res.json({ user: user.toPublic() });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
