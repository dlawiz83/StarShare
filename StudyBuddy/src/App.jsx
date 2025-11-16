import { useEffect, useState } from "react";

function levelFromXP(xp) {
  return Math.floor(xp / 100);
}
function progressPercent(xp) {
  return xp % 100;
}

export default function App() {
  const [xp, setXp] = useState(0);
  const [selected, setSelected] = useState("default");

  const cosmetics = [
    {
      id: "default",
      name: "Blue Buddy",
      level: 0,
      colors: ["#bfdbfe", "#93c5fd"],
    },
    {
      id: "purple",
      name: "Purple Dream",
      level: 5,
      colors: ["#c4b5fd", "#a78bfa"],
    },
    {
      id: "galaxy",
      name: "Galaxy Star",
      level: 10,
      colors: ["#818cf8", "#60a5fa"],
    },
  ];

  useEffect(() => {
    chrome.storage.sync.get({ xp: 0, skin: "default" }, (res) => {
      setXp(res.xp || 0);
      setSelected(res.skin || "default");
    });

    const listener = (changes) => {
      if (changes.xp) {
        const newXp = changes.xp.newValue || 0;
        setXp(newXp);

        const newLevel = levelFromXP(newXp);

        // Auto-unlock & auto-select cosmetics based on new level
        const unlocked = cosmetics
          .filter((c) => newLevel >= c.level)
          .map((c) => c.id);

        if (!unlocked.includes(selected)) {
          const highestUnlocked = unlocked[unlocked.length - 1];
          chrome.storage.sync.set({ skin: highestUnlocked });
          setSelected(highestUnlocked);
        }
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const lvl = levelFromXP(xp);
  const prog = progressPercent(xp);

  const handleSelect = (id) => {
    chrome.storage.sync.set({ skin: id });
    setSelected(id);
  };

  const currentSkin = cosmetics.find((c) => c.id === selected);
  const [c1, c2] = currentSkin.colors;

  return (
    <div
      className="w-80 p-4 font-sans space-y-4 text-gray-900 min-h-[400px] rounded-xl shadow-xl"
      style={{
        background: `linear-gradient(to bottom, ${c1}, ${c2})`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">StudyBuddy</h2>
        <div className="px-2 py-1 rounded-lg bg-white/40 text-xs font-medium">
          Lv. {lvl}
        </div>
      </div>

      {/* Buddy Preview Card */}
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow-lg">
        <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center text-3xl">
          {selected === "default" && "🐦"}
          {selected === "purple" && "🪄"}
          {selected === "galaxy" && "🌌"}
        </div>

        <p className="mt-2 text-sm text-gray-600">{currentSkin.name}</p>
      </div>

      {/* XP Bar */}
      <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl shadow-lg">
        <div className="text-sm text-gray-700 font-medium">Level {lvl}</div>

        <div className="h-3 bg-white/50 rounded-xl mt-2 overflow-hidden">
          <div
            className="h-full rounded-xl transition-all"
            style={{
              width: `${prog}%`,
              background: `linear-gradient(90deg, ${c1}, ${c2})`,
            }}
          />
        </div>

        <div className="text-xs text-gray-600 mt-1">
          {xp} XP • {prog}/100
        </div>
      </div>

      {/* Cosmetics Selection */}
      <div className="bg-white/40 p-4 backdrop-blur-md rounded-2xl shadow-lg">
        <h3 className="text-sm text-gray-700 mb-2 font-medium">Cosmetics</h3>

        <div className="grid grid-cols-3 gap-3">
          {cosmetics.map((c) => {
            const locked = lvl < c.level;
            return (
              <button
                key={c.id}
                onClick={() => !locked && handleSelect(c.id)}
                className={`
                  p-2 rounded-xl text-xs text-center border
                  ${
                    selected === c.id
                      ? "ring-2 ring-white/80 bg-white/60"
                      : "bg-white/40"
                  }
                  ${
                    locked
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-white/60"
                  }
                `}
              >
                <div className="text-base">
                  {c.id === "default" && "🐦"}
                  {c.id === "purple" && "🪄"}
                  {c.id === "galaxy" && "🌌"}
                </div>
                <div className="text-gray-700">{c.name}</div>
                {locked && (
                  <div className="text-[10px] text-red-500">Lv {c.level}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <button
        className="w-full py-2 rounded-xl bg-white/40 hover:bg-white/60 text-sm font-medium transition"
        onClick={() => chrome.storage.sync.set({ xp: 0 })}
      >
        Reset XP
      </button>
    </div>
  );
}
