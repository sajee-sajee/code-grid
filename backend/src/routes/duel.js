const router = require("express").Router();
const auth = require("../middleware/auth");

function toFiniteScore(value) {
    const score = Number(value);
    return Number.isFinite(score) ? score : 0;
}

// POST /api/duel/end — record duel result
router.post("/end", auth, async (req, res) => {
    try {
        const playerScore = toFiniteScore(req.body.playerScore);
        const cpuScore = toFiniteScore(req.body.cpuScore);
        const won = typeof req.body.won === "boolean" ? req.body.won : playerScore > cpuScore;
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
