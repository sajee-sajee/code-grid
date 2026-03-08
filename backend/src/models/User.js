const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const solvedSchema = new mongoose.Schema({
    qId: String,
    levelId: Number,
    diff: String,
    xp: Number,
    fast: Boolean,
    ts: Number,
    daily: Boolean,
}, { _id: false });

const avatarSchema = new mongoose.Schema({
    face: { type: String, default: "🤖" },
    outfit: { type: String, default: "🥋" },
    acc: { type: String, default: "⚡" },
}, { _id: false });

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    username: { type: String, default: "" },
    avatar: { type: avatarSchema, default: () => ({}) },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    unlockedLevel: { type: Number, default: 1 },
    duelWins: { type: Number, default: 0 },
    duelGames: { type: Number, default: 0 },
    fastSolves: { type: Number, default: 0 },
    dailyDone: { type: Boolean, default: false },
    lastDailyDate: { type: String, default: null },
    seenScenes: { type: [Number], default: [] },
    solved: { type: [solvedSchema], default: [] },
}, { timestamps: true });

userSchema.methods.toPublic = function () {
    const obj = this.toObject();
    delete obj.passwordHash;
    delete obj.__v;
    return obj;
};

userSchema.statics.hashPassword = async (password) => bcrypt.hash(password, 10);
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
