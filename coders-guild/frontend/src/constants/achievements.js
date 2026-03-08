export const ACHIEVEMENTS = [
    { id: "first_blood", name: "First Blood", desc: "Solve your first question", icon: "⚡", check: (u) => u.solved.length >= 1 },
    { id: "streak_3", name: "On Fire", desc: "3-day streak", icon: "🔥", check: (u) => u.streak >= 3 },
    { id: "streak_7", name: "Unstoppable", desc: "7-day streak", icon: "💀", check: (u) => u.streak >= 7 },
    { id: "level5", name: "Mid-Tier", desc: "Reach Level 5", icon: "🏆", check: (u) => u.unlockedLevel >= 5 },
    { id: "all_easy", name: "Easy Mode", desc: "Solve 10 easy questions", icon: "✅", check: (u) => u.solved.filter((s) => s.diff === "Easy").length >= 10 },
    { id: "duel_win", name: "Duel Master", desc: "Win your first duel", icon: "⚔️", check: (u) => u.duelWins >= 1 },
    { id: "speedrun", name: "Speedrun", desc: "Solve a question in <60s", icon: "⏱️", check: (u) => u.fastSolves >= 1 },
    { id: "complete", name: "Neo Coder", desc: "Complete all 11 districts", icon: "🌐", check: (u) => u.unlockedLevel > 11 },
];

export const DAILY_POOL = [
    {
        id: "d1", title: "Contains Duplicate", diff: "Easy", xp: 80,
        desc: "Given array `nums`, return `true` if any value appears **at least twice**.",
        examples: [{ i: "nums=[1,2,3,1]", o: "true" }, { i: "nums=[1,2,3,4]", o: "false" }],
        hints: ["Use a Set", "If new Set(nums).size !== nums.length, there are duplicates"],
        start: "function solve(nums) {\n  \n}",
        tests: [{ l: "Has dup", r: (f) => f([1, 2, 3, 1]), e: true }, { l: "No dup", r: (f) => f([1, 2, 3, 4]), e: false }],
    },
    {
        id: "d2", title: "Missing Number", diff: "Easy", xp: 80,
        desc: "Given array `nums` containing n distinct numbers in range [0,n], return the **missing number**.",
        examples: [{ i: "nums=[3,0,1]", o: "2" }, { i: "nums=[0,1]", o: "2" }],
        hints: ["Sum formula: n*(n+1)/2", "Subtract actual sum from expected sum"],
        start: "function solve(nums) {\n  \n}",
        tests: [{ l: "Classic", r: (f) => f([3, 0, 1]), e: 2 }, { l: "End missing", r: (f) => f([0, 1]), e: 2 }],
    },
    {
        id: "d3", title: "Reverse Integer", diff: "Easy", xp: 80,
        desc: "Given a signed integer `x`, return `x` with its digits reversed.",
        examples: [{ i: "x=123", o: "321" }, { i: "x=-123", o: "-321" }],
        hints: ["Convert to string, reverse, convert back", "Handle negative sign"],
        start: "function solve(x) {\n  \n}",
        tests: [{ l: "Positive", r: (f) => f(123), e: 321 }, { l: "Negative", r: (f) => f(-123), e: -321 }],
    },
    {
        id: "d4", title: "Majority Element", diff: "Easy", xp: 80,
        desc: "Given array `nums`, return the **majority element** (appears more than n/2 times).",
        examples: [{ i: "nums=[3,2,3]", o: "3" }, { i: "nums=[2,2,1,1,1,2,2]", o: "2" }],
        hints: ["Boyer-Moore voting algorithm", "Or use a frequency map"],
        start: "function solve(nums) {\n  \n}",
        tests: [{ l: "Simple", r: (f) => f([3, 2, 3]), e: 3 }, { l: "Classic", r: (f) => f([2, 2, 1, 1, 1, 2, 2]), e: 2 }],
    },
];
