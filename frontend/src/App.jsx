import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useUser } from "./contexts/UserContext";
import { recordSolve } from "./services/api";

const CSS_CONTENT = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{background:#030308;color:#a0b4c8;font-family:'Rajdhani',sans-serif;overflow-x:hidden;height:100%}
.ORB{font-family:'Orbitron',monospace} .MONO{font-family:'Share Tech Mono',monospace}
.gG{color:#00ff41;text-shadow:0 0 8px #00ff41,0 0 20px #00ff41}
.gC{color:#00d4ff;text-shadow:0 0 8px #00d4ff,0 0 16px #00d4ff}
.gR{color:#ff0033;text-shadow:0 0 8px #ff0033}
.gP{color:#bf00ff;text-shadow:0 0 8px #bf00ff}
.gY{color:#ffcc00;text-shadow:0 0 8px #ffcc00}
.bG{border:1px solid #00ff41;box-shadow:0 0 8px rgba(0,255,65,.3),inset 0 0 8px rgba(0,255,65,.05)}
.bC{border:1px solid #00d4ff;box-shadow:0 0 8px rgba(0,212,255,.3),inset 0 0 8px rgba(0,212,255,.05)}
.bR{border:1px solid #ff0033;box-shadow:0 0 8px rgba(255,0,51,.3)}
.bP{border:1px solid #bf00ff;box-shadow:0 0 8px rgba(191,0,255,.3)}
.bgG{background:rgba(0,255,65,.07)} .bgC{background:rgba(0,212,255,.07)}
.bgR{background:rgba(255,0,51,.07)} .bgP{background:rgba(191,0,255,.07)}
.bg-card{background:rgba(0,8,18,.95)} .bg-panel{background:rgba(0,15,32,.85)}
.bg-grid{background-image:linear-gradient(rgba(0,212,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,.04) 1px,transparent 1px);background-size:44px 44px}
.clip-all{clip-path:polygon(12px 0,calc(100% - 12px) 0,100% 12px,100% calc(100% - 12px),calc(100% - 12px) 100%,12px 100%,0 calc(100% - 12px),0 12px)}
.clip-tl{clip-path:polygon(14px 0,100% 0,100% 100%,0 100%,0 14px)}
.clip-btn{clip-path:polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)}
@keyframes glitch{0%,87%,100%{transform:none;filter:none}88%{transform:translate(-3px,1px) skewX(-2deg);filter:hue-rotate(180deg)}90%{transform:translate(3px,-1px);filter:brightness(1.5)}92%{transform:translate(-1px,2px) skewX(1deg)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideL{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
@keyframes pulse-g{0%,100%{box-shadow:0 0 6px #00ff41}50%{box-shadow:0 0 20px #00ff41,0 0 40px rgba(0,255,65,.3)}}
@keyframes pulse-c{0%,100%{box-shadow:0 0 6px #00d4ff}50%{box-shadow:0 0 20px #00d4ff,0 0 40px rgba(0,212,255,.3)}}
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
.btn-ghost{background:transparent;color:#00d4ff;border:1px solid rgba(0,212,255,.5);clip-path:none}
.btn-ghost:hover{background:rgba(0,212,255,.1);border-color:#00d4ff}
.btn-sm{padding:6px 14px;font-size:9px}.btn-lg{padding:14px 36px;font-size:13px}
input,.cyber-input{background:rgba(0,8,18,.9)!important;border:1px solid rgba(0,212,255,.35)!important;color:#00d4ff!important;font-family:'Share Tech Mono',monospace!important;padding:10px 14px;font-size:14px;outline:none!important;transition:all .2s;width:100%}
input:focus,.cyber-input:focus{border-color:#00d4ff!important;box-shadow:0 0 12px rgba(0,212,255,.4)!important}
input::placeholder{color:rgba(0,212,255,.3)!important}
.code-ed{background:#000a0f;border:1px solid rgba(0,255,65,.4);color:#00ff41;font-family:'Share Tech Mono',monospace;font-size:13.5px;line-height:1.65;padding:16px;resize:none;outline:none;transition:all .2s;width:100%;tab-size:2}
.code-ed:focus{border-color:#00ff41;box-shadow:0 0 16px rgba(0,255,65,.3),inset 0 0 24px rgba(0,255,65,.04)}
::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:rgba(0,0,0,.3)}::-webkit-scrollbar-thumb{background:#00d4ff;border-radius:2px}
.badge-e{background:rgba(0,255,65,.15);color:#00ff41;border:1px solid rgba(0,255,65,.4);padding:2px 10px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.badge-m{background:rgba(255,204,0,.15);color:#ffcc00;border:1px solid rgba(255,204,0,.4);padding:2px 10px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.badge-h{background:rgba(255,0,51,.15);color:#ff0033;border:1px solid rgba(255,0,51,.4);padding:2px 10px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;clip-path:polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)}
.district-card{cursor:pointer;transition:all .25s ease}
.district-card:hover:not(.locked){transform:translateY(-5px) scale(1.03)}
.district-card.locked{filter:brightness(.2) saturate(0);cursor:not-allowed;pointer-events:none}
.hr-cyber{border:none;height:1px;background:linear-gradient(90deg,transparent,#00d4ff,transparent);margin:16px 0}
select{background:rgba(0,8,18,.9)!important;border:1px solid rgba(0,212,255,.35)!important;color:#00d4ff!important;font-family:'Share Tech Mono',monospace!important;padding:10px 14px;font-size:14px;outline:none!important;cursor:pointer}
.avatar-ring{border-radius:50%;background:rgba(0,15,30,.9);border:2px solid #00d4ff;box-shadow:0 0 15px rgba(0,212,255,.5);display:flex;align-items:center;justify-content:center}
`;

export default function App() {
  const { user, patchUser, loading } = useUser();
  const [screen, setScreen] = useState("landing");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [duelConfig, setDuelConfig] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pendingScene, setPendingScene] = useState(null);

  // Inject global CSS once
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS_CONTENT;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user && (screen === "landing" || screen === "login" || screen === "signup")) {
      setScreen("dashboard");
    }
  }, [loading, user]);

  const showNotif = (msg, color = "#00ff41") => {
    setNotification({ msg, color });
    setTimeout(() => setNotification(null), 3000);
  };

  const nav = (target) => setScreen(target);

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
    patchUser({ unlockedLevel: Math.max(user.unlockedLevel, levelId + 1), xp: user.xp + 200 });
    showNotif(`District ${levelId} cleared! +200 XP bonus!`, "#00d4ff");
  };

  const handleDuelEnd = (result) => {
    setDuelResult(result);
    showNotif(result.won ? "⚔️ VICTORY! +50 XP" : "💀 Defeated. Train harder.", result.won ? "#00ff41" : "#ff0033");
    setScreen("duel-result");
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
      <div style={{ minHeight: "100vh", background: "#030308", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="ORB gC" style={{ fontSize: 14, letterSpacing: ".3em", animation: "pulse-c 1.5s ease-in-out infinite" }}>
          CONNECTING TO GRID...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#030308" }}>
      {/* Notification toast */}
      {notification && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "12px 24px", fontFamily: "Orbitron,monospace", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", background: "rgba(0,8,18,.95)", border: `1px solid ${notification.color}`, boxShadow: `0 0 20px ${notification.color}66`, color: notification.color, animation: "fadeIn .3s ease", clipPath: "polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)" }}>
          {notification.msg}
        </div>
      )}

      {/* Cinematic Scene Overlay */}
      {screen === "scene" && pendingScene && (
        <CinematicScene sceneId={pendingScene.sceneId} onSkip={handleSceneComplete} />
      )}

      {screen === "landing" && <LandingPage onNav={nav} />}
      {screen === "login" && <AuthPage mode="login" onNav={nav} onSuccess={handleAuthSuccess} />}
      {screen === "signup" && <AuthPage mode="signup" onNav={nav} onSuccess={handleAuthSuccess} />}
      {screen === "profile-setup" && user && <ProfileSetupPage onComplete={handleProfileComplete} />}
      {screen === "dashboard" && user && <Dashboard user={user} onNav={nav} />}
      {screen === "solo" && user && <SoloPage user={user} onNav={nav} onSelectLevel={handleSelectLevel} />}
      {screen === "level-questions" && user && <LevelQuestions levelId={selectedLevel} onNav={nav} onLevelComplete={handleLevelComplete} />}
      {screen === "daily" && user && <DailyQuestPage onNav={nav} />}
      {screen === "duel-setup" && user && <DuelSetupPage onNav={nav} onStartDuel={(cfg) => { setDuelConfig(cfg); nav("duel-battle"); }} />}
      {screen === "duel-battle" && user && duelConfig && <DuelBattle user={user} duelConfig={duelConfig} onNav={nav} onDuelEnd={handleDuelEnd} />}
      {screen === "duel-result" && user && duelResult && <DuelResult result={duelResult} onNav={nav} />}
    </div>
  );
}
