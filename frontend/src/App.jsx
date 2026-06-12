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

export default function App() {
  const { user, patchUser, loading } = useUser();
  const [screen, setScreen] = useState("landing");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [duelConfig, setDuelConfig] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pendingScene, setPendingScene] = useState(null);

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
