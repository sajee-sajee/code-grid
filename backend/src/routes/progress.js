const router = require("express").Router();
const auth = require("../middleware/auth");

// POST /api/progress/solve — record a solved question
router.post("/solve", auth, async (req, res) => {
    try {
        const { qId, levelId, diff, xp, fast, ts, daily } = req.body;
        const user = req.user;

        // Prevent duplicate records
        if (user.solved.some((s) => s.qId === qId)) {
            return res.json({ user: user.toPublic() });
        }

        user.solved.push({ qId, levelId, diff, xp, fast, ts, daily });
        user.xp += xp;
        if (fast) user.fastSolves += 1;

        // Update streak if daily
        if (daily) {
            const now = new Date();
            const lastDate = user.lastDailyDate ? new Date(user.lastDailyDate) : null;
            if (lastDate && (now - lastDate) < 172800000) {
                user.streak += 1;
            } else {
                user.streak = 1;
            }
            user.dailyDone = true;
            user.lastDailyDate = now.toISOString();
        }

        // Unlock next level if all 3 in current district solved
        const inLevel = user.solved.filter((s) => s.levelId === levelId);
        if (inLevel.length >= 3 && levelId >= user.unlockedLevel) {
            user.unlockedLevel = Math.max(user.unlockedLevel, levelId + 1);
            user.xp += 200; // bonus for clearing district
        }

        await user.save();
        res.json({ user: user.toPublic() });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// GET /api/progress — get full progress for auth user
router.get("/", auth, async (req, res) => {
    res.json({ solved: req.user.solved, xp: req.user.xp, unlockedLevel: req.user.unlockedLevel });
});

module.exports = router;
