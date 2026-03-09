# ⚡ CODERS GUILD — Gamified DSA Learning Platform

> *"In a world controlled by MegaCorp algorithms, the Coders Guild trains elite programmers to reclaim the network. Your mission begins now, recruit."*

---

## 🎮 Core Concept

**Coders Guild** is a cyberpunk-themed, gamified Data Structures & Algorithms (DSA) learning platform built in React. It transforms coding education into an immersive narrative RPG — where learners aren't students, they're *operatives* fighting to liberate a city from an AI takeover.

The platform turns the traditionally dry process of learning DSA into a story-driven experience complete with cinematic cutscenes, XP systems, duels, streaks, and achievement unlocks — all while teaching real programming skills through hands-on coding challenges.

---

## 🗺️ Platform Structure

### 🏙️ The World: 11 Districts = 11 DSA Topics

Each district represents a DSA topic and is unlocked progressively as the player completes missions:

| District | Topic | Accent Color |
|---|---|---|
| 1 — Training Zone | Arrays | `#00ff41` Green |
| 2 — String Market | Strings | `#00d4ff` Cyan |
| 3 — Recursion Lab | Recursion | `#bf00ff` Purple |
| 4 — Hash District | Hash Tables | `#ffcc00` Gold |
| 5 — Stack Tower | Stacks | `#ff6600` Orange |
| 6 — Queue Transit | Queues | `#00ffcc` Teal |
| 7 — Linked Network | Linked Lists | `#ff66cc` Pink |
| 8 — Sorting Factory | Sorting Algorithms | `#66ff66` Lime |
| 9 — Binary Sector | Binary Search | `#ffaa00` Amber |
| 10 — Tree Nexus | Trees | `#00aaff` Blue |
| 11 — Graph Citadel | Graphs (Final Boss) | `#ff3366` Red |

---

## 🎯 Game Modes

### 🗺️ Cyber Campaign (Solo Story Mode)
The primary progression loop. Players work through districts sequentially, each requiring 3 coding missions to unlock the next. Every district entry triggers a **cinematic scene** with animated storytelling and typewriter dialogue.

- **3 missions per district** (Easy → Medium → Hard)
- **Progressive unlock** — complete all 3 missions to advance
- **+200 XP district clear bonus**
- Animated district completion screen

### 📅 Daily Quest
A rotating daily coding challenge that maintains engagement through **streak mechanics**.

- New question every 24 hours (rotates from a curated pool)
- **+20 XP streak bonus** on top of base XP
- 14-day streak calendar visualization
- "Daily Done" state prevents repeat submissions

### ⚔️ Duel Arena (PvP vs AI)
Real-time coding battle against **NEXUS-7**, the AI antagonist.

- Choose topic and difficulty before entering
- **3-minute countdown timer** — score = 200 + (time remaining × 1.2)
- CPU opponent simulates solving at difficulty-scaled speed (Easy: 60s, Medium: 100s, Hard: 150s)
- Win = +50 XP + win recorded on profile
- Score comparison shown on animated result screen

---

## ⚙️ Core Mechanics

### XP & Leveling
```
Level = floor(totalXP / 300) + 1
XP within level = totalXP % 300
```
- XP displayed as a progress bar on the dashboard
- Every solved question awards XP based on difficulty

### Question Difficulty & XP Rewards
| Difficulty | Base XP Range |
|---|---|
| Easy | 100 – 130 XP |
| Medium | 140 – 180 XP |
| Hard | 250 – 280 XP |

### Streak System
- Solving any question within 24 hours of the last solve maintains the streak
- Streaks drive the Daily Quest mode
- Displayed on the dashboard with a fire emoji counter 🔥

### Fast Solve Bonus
Solving a question in under 60 seconds awards a **fast solve** — tracked separately for achievements.

---

## 🏆 Achievements

| Achievement | Condition | Icon |
|---|---|---|
| First Blood | Solve your first question | ⚡ |
| On Fire | Reach a 3-day streak | 🔥 |
| Unstoppable | Reach a 7-day streak | 💀 |
| Mid-Tier | Reach Level 5 | 🏆 |
| Easy Mode | Solve 10 Easy questions | ✅ |
| Duel Master | Win your first duel | ⚔️ |
| Speedrun | Solve a question in under 60 seconds | ⏱️ |
| Neo Coder | Complete all 11 districts | 🌐 |

---

## 🎬 Cinematic Scene System

Each district entry (first visit only) triggers a **full-screen cinematic** with:

- Animated background (pan / zoom / oscillate effects)
- Floating DSA-themed particle system (e.g., `[0] [1] [n]` for Arrays, `key hash O(1)` for Hash Tables)
- Foreground hero emoji with glow
- **Typewriter dialogue** — lines typed character-by-character with cursor blink
- Vignette overlay, scanline canvas effect, corner frame decorations
- Click-anywhere to skip

Scenes are shown **only once per district** — tracked in `user.seenScenes[]`.

---

## 💻 Code Execution Engine

The in-browser judge uses `new Function()` to evaluate player-submitted JavaScript:

```js
function evalCode(code, tests) {
  // Wraps submitted code, extracts the `solve` function
  // Runs each test case against it
  // Returns { label, passed, output, expected, error }[]
}
```

**Features:**
- Tab key → 2-space indent in the editor
- Reset button to restore starter code
- Per-test-case pass/fail feedback with expected vs. actual output
- Error messages surfaced inline

---

## 👤 Player Profile

### Setup (on first registration)
- **Codename** (username, min 3 chars)
- **Avatar Face** — 10 options
- **Outfit Module** — 7 options
- **Accessory Chip** — 8 options
- Live preview updates as selections are made

### Profile Stats Tracked
```js
{
  xp, streak, solved[], unlockedLevel,
  duelWins, duelGames, fastSolves,
  dailyDone, lastDailyDate, seenScenes[]
}
```

---

## 🎨 Design System

Built around a **cyberpunk aesthetic** with a consistent design language:

### Typography
- `Orbitron` — headings, labels, UI chrome (futuristic geometric)
- `Share Tech Mono` — code, terminal text, data readouts
- `Rajdhani` — body text (readable sans)

### Color Palette
| Role | Color |
|---|---|
| Primary Green (hacker) | `#00ff41` |
| Primary Cyan (data) | `#00d4ff` |
| Danger Red | `#ff0033` |
| Warning Gold | `#ffcc00` |
| Arcane Purple | `#bf00ff` |
| Background | `#030308` |

### UI Components
- **Clip-path polygons** — all cards and buttons have chamfered corners (cyberpunk cut)
- **Glow effects** — `text-shadow` and `box-shadow` on every interactive element
- **Matrix Rain** — animated canvas background on landing/auth screens
- **Animated grid overlay** — subtle dot/line grid across all pages
- **Glitch animation** — title text glitches periodically
- Scrollbars, inputs, selects all custom-styled to match theme

---

## 📁 Project Architecture

```
App.jsx
│
├── CSS (global styles injected via useEffect)
│
├── SCENES{}              — 12 cinematic scene definitions (0-11)
├── DISTRICTS[]           — 11 district metadata objects
├── QUESTIONS{}           — 33 coding questions (3 per district)
├── ACHIEVEMENTS[]        — 8 achievement definitions
├── DAILY_POOL[]          — 4 rotating daily challenges
│
├── Components
│   ├── CinematicScene    — Full-screen animated cutscene
│   ├── MatrixRain        — Canvas-based falling character animation
│   ├── CodeEditor        — Textarea with Tab-indent support
│   ├── XBar              — Animated XP / progress bar
│   ├── CyberCard         — Clip-path styled card container
│   └── Btn               — Variant-based styled button
│
└── Pages
    ├── LandingPage       — Animated hero with scrambled text
    ├── AuthPage          — Login / Signup terminal
    ├── ProfileSetupPage  — Avatar builder
    ├── Dashboard         — Stats, progress, mode selection
    ├── SoloPage          — District map
    ├── LevelQuestions    — Code editor + judge
    ├── DailyQuestPage    — Streak tracker + daily challenge
    ├── DuelSetupPage     — Battle configuration
    ├── DuelBattle        — Real-time PvP coding arena
    └── DuelResult        — Win/loss outcome screen
```

---

## 🧩 Question Coverage (33 Total)

| District | Q1 | Q2 | Q3 |
|---|---|---|---|
| Arrays | Two Sum | Max Subarray | Best Time to Buy & Sell |
| Strings | Valid Palindrome | Longest Substring Without Repeating | Anagram Check |
| Recursion | Fibonacci Number | Power Function | Count Ways to Climb |
| Hash Tables | First Non-Repeating Char | Intersection of Two Arrays | Subarray Sum Equals K |
| Stacks | Valid Parentheses | Reverse String with Stack | Daily Temperatures |
| Queues | Number of Recent Calls | Moving Average | Task Scheduler |
| Linked Lists | Reverse Linked List | Middle of Linked List | Merge Two Sorted Lists |
| Sorting | Bubble Sort | Merge Sort | Sort Colors (DNF) |
| Binary Search | Binary Search | Search Insert Position | Peak Element |
| Trees | Max Depth of Binary Tree | Same Tree | Level Order Traversal |
| Graphs | Number of Islands | BFS Shortest Path | Clone Graph |

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/coders-guild.git

# Install dependencies
npm install

# Start development server
npm run dev
```

The app is a single self-contained React component (`App.jsx`) with no external backend dependencies. All state is managed in-memory via React hooks.

### Demo Credentials
- **New account** → triggers full onboarding cinematic + profile setup
- **Existing account** → logs in with mock progress (Districts 1-2 cleared, Level 4, 3-day streak)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (hooks-based) |
| Styling | Pure CSS-in-JS (injected stylesheet) |
| Fonts | Google Fonts (Orbitron, Share Tech Mono, Rajdhani) |
| Code Execution | `new Function()` sandboxed eval |
| Animation | CSS keyframes + Canvas API |
| State | React `useState` / `useEffect` / `useCallback` |
| Data | Hardcoded constants (no backend) |

---

## 🔮 Potential Extensions

- **Leaderboard** — global ranking by XP / win rate
- **More districts** — Dynamic Programming, Greedy, Tries, etc.
- **Code replay** — watch how others solved a problem

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

*Built with ⚡ by the Coders Guild. Free the network. One algorithm at a time.*