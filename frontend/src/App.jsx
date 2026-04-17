import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import Dashboard from "./pages/Dashboard";
import SoloPage from "./pages/SoloPage";
import LevelQuestions from "./pages/LevelQuestions";
import DailyQuestPage from "./pages/DailyQuestPage";
import DuelSetupPage from "./pages/DuelSetupPage";
import DuelBattle from "./pages/DuelBattle";
import DuelResult from "./pages/DuelResult";
import CinematicScene from "./components/CinematicScene";
import { useUser } from "./contexts/useUser";
import { recordDuelEnd } from "./services/api";
import { normalizeDuelResult } from "./utils/duelOutcome";
import { DISTRICTS } from "./constants/districts";

const CSS_CONTENT = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--page-bg);color:var(--text-main);font-family:'Rajdhani',sans-serif;overflow-x:hidden;height:100%}
.ORB{font-family:'Orbitron',monospace} .MONO{font-family:'Share Tech Mono',monospace}
.gG{color:var(--green);text-shadow:0 0 8px var(--green),0 0 20px var(--green)}
.gC{color:var(--cyan);text-shadow:0 0 8px var(--cyan),0 0 16px var(--cyan)}
.gR{color:var(--red);text-shadow:0 0 8px var(--red)}
.gP{color:var(--purple);text-shadow:0 0 8px var(--purple)}
.gY{color:var(--yellow);text-shadow:0 0 8px var(--yellow)}
.bG{border:1px solid var(--green);box-shadow:0 0 8px rgba(var(--green-rgb),.3),inset 0 0 8px rgba(var(--green-rgb),.05)}
.bC{border:1px solid var(--cyan);box-shadow:0 0 8px rgba(var(--cyan-rgb),.3),inset 0 0 8px rgba(var(--cyan-rgb),.05)}
.bR{border:1px solid var(--red);box-shadow:0 0 8px rgba(var(--red-rgb),.3)}
.bP{border:1px solid var(--purple);box-shadow:0 0 8px rgba(var(--purple-rgb),.3)}
.bgG{background:rgba(var(--green-rgb),.07)} .bgC{background:rgba(var(--cyan-rgb),.07)}
.bgR{background:rgba(var(--red-rgb),.07)} .bgP{background:rgba(var(--purple-rgb),.07)}
.bg-card{background:rgba(var(--bg-card-rgb),.95)} .bg-panel{background:rgba(var(--bg-panel-rgb),.85)}
.bg-grid{background-image:linear-gradient(rgba(var(--cyan-rgb),.04) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--cyan-rgb),.04) 1px,transparent 1px);background-size:44px 44px}
.clip-all{clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 12px)}
.clip-tl{clip-path:polygon(14px 0,100% 0,100% 100%,0 100%,0 14px)}
.clip-btn{clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
@keyframes glitch{0%,87%,100%{transform:none;filter:none}88%{transform:translate(-3px,1px) skewX(-2deg);filter:hue-rotate(180deg)}90%{transform:translate(3px,-1px);filter:brightness(1.5)}92%{transform:translate(-1px,2px) skewX(1deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse-g{0%,100%{box-shadow:0 0 6px var(--green)}50%{box-shadow:0 0 20px var(--green),0 0 40px rgba(var(--green-rgb),.3)}}
@keyframes pulse-c{0%,100%{box-shadow:0 0 6px var(--cyan)}50%{box-shadow:0 0 20px var(--cyan),0 0 40px rgba(var(--cyan-rgb),.3)}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes levelUp{0%{transform:scale(0) rotate(-180deg);opacity:0}60%{transform:scale(1.15) rotate(8deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes xpFloat{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-60px) scale(1.4)}}
@keyframes countdown{from{stroke-dashoffset:0}to{stroke-dashoffset:283}}
@keyframes scanPulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes borderRun{0%{background-position:0% 0%}100%{background-position:200% 0%}}
@keyframes sceneBgZoomIn{0%{transform:scale(1)}100%{transform:scale(1.08)}}
@keyframes sceneBgZoomOut{0%{transform:scale(1.08)}100%{transform:scale(1)}}
@keyframes sceneBgPanLeft{0%{transform:translateX(0)}100%{transform:translateX(-40px)}}
@keyframes sceneBgPanRight{0%{transform:translateX(0)}100%{transform:translateX(40px)}}
@keyframes sceneBgPanUp{0%{transform:translateY(0)}100%{transform:translateY(-25px)}}
@keyframes sceneFgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes sceneFgDriftH{0%,100%{transform:translateX(0)}50%{transform:translateX(8px)}}
@keyframes sceneFgScale{0%{transform:scale(1)}100%{transform:scale(1.03)}}
@keyframes subtitleReveal{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes scanLine{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}
@keyframes vignettePulse{0%,100%{opacity:.6}50%{opacity:.85}}
@keyframes skipBlink{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes sceneFlicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:.85}94%{opacity:1}97%{opacity:.9}98%{opacity:1}}
@keyframes gridShimmer{0%{opacity:.4}50%{opacity:.7}100%{opacity:.4}}
.aGlitch{animation:glitch 5s infinite}.aFloat{animation:float 3s ease-in-out infinite}
.aPulseG{animation:pulse-g 2s ease-in-out infinite}.aPulseC{animation:pulse-c 2s ease-in-out infinite}
.aFadeUp{animation:fadeUp .4s ease both}.aFadeIn{animation:fadeIn .3s ease both}
.aSlideL{animation:slideL .35s ease both}.aShake{animation:shake .35s ease}
.aLevelUp{animation:levelUp .6s cubic-bezier(.175,.885,.32,1.275) both}
.aXp{animation:xpFloat 1.4s ease-out forwards}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 22px;font-family:'Orbitron',monospace;font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;border:none;transition:all .2s;user-select:none;position:relative}
.btn:hover{filter:brightness(1.2);transform:translateY(-2px)}.btn:active{transform:translateY(0);filter:brightness(.9)}
.btn-g{background:linear-gradient(135deg,#003a0f,#00c830);color:#000;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.btn-c{background:linear-gradient(135deg,#003040,#00a8cc);color:#000;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.btn-r{background:linear-gradient(135deg,#400010,#cc0028);color:#fff;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.btn-p{background:linear-gradient(135deg,#200040,#9900cc);color:#fff;clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
.btn-ghost{background:transparent;color:var(--cyan);border:1px solid rgba(var(--cyan-rgb),.5);clip-path:none}
.btn-ghost:hover{background:rgba(var(--cyan-rgb),.1);border-color:var(--cyan)}
.btn-sm{padding:6px 14px;font-size:9px}.btn-lg{padding:14px 36px;font-size:13px}
input,.cyber-input{background:rgba(var(--bg-card-rgb),.9)!important;border:1px solid rgba(var(--cyan-rgb),.35)!important;color:var(--cyan)!important;font-family:'Share Tech Mono',monospace!important;padding:10px 14px;font-size:14px;outline:none!important;transition:all .2s;width:100%}
input:focus,.cyber-input:focus{border-color:var(--cyan)!important;box-shadow:0 0 12px rgba(var(--cyan-rgb),.4)!important}
input::placeholder{color:rgba(var(--cyan-rgb),.3)!important}
.code-ed{background:#000a0f;border:1px solid rgba(var(--green-rgb),.4);color:var(--green);font-family:'Share Tech Mono',monospace;font-size:13.5px;line-height:1.65;padding:16px;resize:none;outline:none;transition:all .2s;width:100%;tab-size:2}
.code-ed:focus{border-color:var(--green);box-shadow:0 0 16px rgba(var(--green-rgb),.3),inset 0 0 24px rgba(var(--green-rgb),.04)}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:rgba(0,0,0,.3)}::-webkit-scrollbar-thumb{background:var(--cyan);border-radius:2px}
.badge-e{background:rgba(var(--green-rgb),.15);color:var(--green);border:1px solid rgba(var(--green-rgb),.4);padding:2px 10px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.badge-m{background:rgba(var(--yellow-rgb),.15);color:var(--yellow);border:1px solid rgba(var(--yellow-rgb),.4);padding:2px 10px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.badge-h{background:rgba(var(--red-rgb),.15);color:var(--red);border:1px solid rgba(var(--red-rgb),.4);padding:2px 10px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.district-card{cursor:pointer;transition:all .25s ease}
.district-card:hover:not(.locked){transform:translateY(-5px) scale(1.03)}
.district-card.locked{filter:brightness(.2) saturate(0);cursor:not-allowed;pointer-events:none}
.hr-cyber{border:none;height:1px;background:linear-gradient(90deg,transparent,var(--cyan),transparent);margin:16px 0}
select{background:rgba(var(--bg-card-rgb),.9)!important;border:1px solid rgba(var(--cyan-rgb),.35)!important;color:var(--cyan)!important;font-family:'Share Tech Mono',monospace!important;padding:10px 14px;font-size:14px;outline:none!important;cursor:pointer}
.avatar-ring{border-radius:50%;background:rgba(var(--bg-panel-rgb),.9);border:2px solid var(--cyan);box-shadow:0 0 15px rgba(var(--cyan-rgb),.5);display:flex;align-items:center;justify-content:center}
:root {
  --page-bg: #030308;
  --text-main: #a0b4c8;
  --bg-card-rgb: 0, 8, 18;
  --bg-panel-rgb: 0, 15, 30;
  --cyan: #00d4ff;
  --cyan-rgb: 0, 212, 255;
  --green: #00ff41;
  --green-rgb: 0, 255, 65;
  --red: #ff0033;
  --red-rgb: 255, 0, 51;
  --purple: #bf00ff;
  --purple-rgb: 191, 0, 255;
  --yellow: #ffcc00;
  --yellow-rgb: 255, 204, 0;
  --orange: #ffb400;
  --orange-rgb: 255, 180, 0;
  --text-muted-rgb: 160, 180, 200;
  --white-rgb: 255, 255, 255;
}
}
`;

export default function App() {
  const { user, patchUser, setUser, loading } = useUser();
  const [screen, setScreen] = useState("landing");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [duelConfig, setDuelConfig] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pendingScene, setPendingScene] = useState(null);

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS_CONTENT;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  const activeScreen = !loading && user && (screen === "landing" || screen === "login" || screen === "signup")
    ? "dashboard"
    : screen;

  const showNotif = (msg, color = "var(--green)") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 3000);
  };

  const nav = (target) => {
    if (target === "next-district") {
      const nextLevelId = Math.min(11, (duelConfig?.levelId || 1) + 1);
      const nextDistrict = DISTRICTS.find(d => d.id === nextLevelId);
      if (nextDistrict) {
        setDuelConfig({ topic: nextDistrict.topic, diff: duelConfig?.diff || "Easy", levelId: nextLevelId });
        const alreadySeen = user?.seenScenes?.includes(nextLevelId);
        if (!alreadySeen) {
          patchUser({ seenScenes: [...(user.seenScenes || []), nextLevelId] });
          setPendingScene({ sceneId: nextLevelId, nextScreen: "duel-battle" });
          setScreen("scene");
        } else {
          setScreen("duel-battle");
        }
        return;
      }
      setScreen("dashboard");
      return;
    }
    setScreen(target);
  };

  const handleAuthSuccess = (user, isNew) => {
    if (isNew) {
      setPendingScene({ sceneId: 0, nextScreen: "profile-setup" });
      setScreen("scene");
    } else {
      setScreen("dashboard");
    }
  };

  const handleProfileComplete = ({ username }) => {
    showNotif(`Welcome, ${username}! Your mission begins.`);
    setScreen("dashboard");
  };

  const handleLevelComplete = (levelId) => {
    showNotif(`District ${levelId} cleared! +200 XP bonus!`, "var(--cyan)");
  };

  const handleDuelEnd = (result) => {
    const nextResult = normalizeDuelResult(result);

    setDuelResult(nextResult);
    setScreen("duel-result");
    showNotif(
      nextResult.isTie ? "⚖️ Draw! Scores matched." : nextResult.won ? "⚔️ VICTORY!" : "💀 Defeated. Train harder.",
      nextResult.isTie ? "var(--yellow)" : nextResult.won ? "var(--green)" : "var(--red)",
    );

    recordDuelEnd({
      won: nextResult.won,
      playerScore: nextResult.playerScore,
      cpuScore: nextResult.cpuScore,
    })
      .then((res) => setUser(res.data.user))
      .catch(() => {
        showNotif("Battle finished, but the duel result could not be saved.", "var(--yellow)");
      });
  };

  const handleSelectLevel = (levelId) => {
    setSelectedLevel(levelId);
    const alreadySeen = user?.seenScenes?.includes(levelId);
    if (!alreadySeen) {
      patchUser({ seenScenes: [...(user.seenScenes || []), levelId] });
      setPendingScene({ sceneId: levelId, nextScreen: "level-questions" });
      setScreen("scene");
    } else {
      setScreen("level-questions");
    }
  };

  const handleSceneComplete = () => {
    if (pendingScene) {
      const next = pendingScene.nextScreen;
      setPendingScene(null);
      setScreen(next);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--page-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="ORB gC" style={{ fontSize: 14, letterSpacing: ".3em", animation: "pulse-c 1.5s ease-in-out infinite" }}>
          CONNECTING TO GRID...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--page-bg)" }}>
      {/* Notification toast */}
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "12px 24px", fontFamily: "Orbitron,monospace", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", background: "rgba(var(--bg-card-rgb),.95)", border: `1px solid ${notification.color}`, boxShadow: `0 0 20px ${notification.color}66`, color: notification.color, animation: "fadeIn .3s ease", clipPath: "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)" }}>
          {notification.msg}
        </div>
      )}

      {/* Cinematic Scene Overlay */}
      {activeScreen === "scene" && pendingScene && (
        <CinematicScene sceneId={pendingScene.sceneId} onSkip={handleSceneComplete} />
      )}

      {activeScreen === "landing" && <LandingPage onNav={nav} />}
      {activeScreen === "login" && <AuthPage mode="login" onNav={nav} onSuccess={handleAuthSuccess} />}
      {activeScreen === "signup" && <AuthPage mode="signup" onNav={nav} onSuccess={handleAuthSuccess} />}
      {activeScreen === "profile-setup" && user && <ProfileSetupPage onComplete={handleProfileComplete} />}
      {activeScreen === "dashboard" && user && <Dashboard user={user} onNav={nav} />}
      {activeScreen === "solo" && user && <SoloPage user={user} onNav={nav} onSelectLevel={handleSelectLevel} />}
      {activeScreen === "level-questions" && user && <LevelQuestions levelId={selectedLevel} onNav={nav} onLevelComplete={handleLevelComplete} />}
      {activeScreen === "daily" && user && <DailyQuestPage onNav={nav} />}
      {activeScreen === "duel-setup" && user && <DuelSetupPage onNav={nav} onStartDuel={(cfg) => { setDuelConfig(cfg); nav("duel-battle"); }} />}
      {activeScreen === "duel-battle" && user && duelConfig && <DuelBattle user={user} duelConfig={duelConfig} onDuelEnd={handleDuelEnd} />}
      {activeScreen === "duel-result" && user && duelResult && <DuelResult result={duelResult} onNav={nav} />}
    </div>
  );
}
