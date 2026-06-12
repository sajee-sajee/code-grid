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

export default function App() {
  const { user, patchUser, setUser, loading } = useUser();
  const [screen, setScreen] = useState("landing");
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [duelConfig, setDuelConfig] = useState(null);
  const [duelResult, setDuelResult] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pendingScene, setPendingScene] = useState(null);

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
      {activeScreen === "duel-setup" && user && <DuelSetupPage onNav={nav} onStartDuel={(cfg) => { setDuelConfig({ ...cfg, levelId: selectedLevel }); nav("duel-battle"); }} />}
      {activeScreen === "duel-battle" && user && duelConfig && <DuelBattle user={user} duelConfig={duelConfig} onNav={nav} onDuelEnd={handleDuelEnd} />}
      {activeScreen === "duel-result" && user && duelResult && <DuelResult result={duelResult} onNav={nav} />}
    </div>
  );
}
