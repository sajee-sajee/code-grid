const router = require("express").Router();
const auth = require("../middleware/auth");

// POST /api/duel/end — record duel result
router.post("/end", auth, async (req, res) => {
    try {
        const { won, playerScore, cpuScore } = req.body;
        const user = req.user;

        user.duelGames += 1;
        if (won) {
            user.duelWins += 1;
            user.xp += 50;
        }

        await user.save();
        res.json({ user: user.toPublic() });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = router;
