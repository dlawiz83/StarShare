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
    { id: "default", name: "Classic Pink", level: 0 },
    { id: "purple", name: "Purple Dream", level: 5 },
    { id: "galaxy", name: "Galaxy Star", level: 10 },
  ];

  useEffect(() => {
    chrome.storage.sync.get({ xp: 0, skin: "default" }, (res) => {
      setXp(res.xp || 0);
      setSelected(res.skin || "default");
    });

    const listener = (changes) => {
      if (changes.xp) setXp(changes.xp.newValue || 0);
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

  return (
    <div className="w-80 p-4 font-sans space-y-4 bg-gradient-to-b from-purple-600 to-indigo-700 min-h-[400px] text-white rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">StudyBuddy</h2>
        <div className="px-2 py-1 rounded-lg bg-white/20 text-xs">
          Lv. {lvl}
        </div>
      </div>

      {/* Buddy Preview Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center shadow-lg">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl">
          🐣
        </div>

        <p className="mt-2 text-sm text-purple-200">
          {selected === "default" && "Classic Pink Buddy"}
          {selected === "purple" && "Purple Dream Buddy"}
          {selected === "galaxy" && "Galaxy Star Buddy"}
        </p>
      </div>

      {/* XP Bar */}
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg">
        <div className="text-sm text-purple-200">Level {lvl}</div>

        <div className="h-3 bg-purple-900/40 rounded-xl mt-2 overflow-hidden">
          <div
            className="h-full rounded-xl transition-all"
            style={{
              width: `${prog}%`,
              background: "linear-gradient(90deg, #f472b6, #c084fc, #818cf8)",
            }}
          />
        </div>

        <div className="text-xs text-purple-200 mt-1">
          {xp} XP • {prog}/100
        </div>
      </div>

      {/* Cosmetics Selection */}
      <div className="bg-white/10 p-4 backdrop-blur-md rounded-2xl shadow-lg">
        <h3 className="text-sm text-purple-100 mb-2 font-medium">Cosmetics</h3>

        <div className="grid grid-cols-3 gap-3">
          {cosmetics.map((c) => {
            const locked = lvl < c.level;

            return (
              <button
                key={c.id}
                onClick={() => !locked && handleSelect(c.id)}
                className={`
                  p-2 rounded-xl text-xs text-center transition-all border border-white/20
                  ${
                    selected === c.id
                      ? "ring-2 ring-pink-300 bg-white/20"
                      : "bg-white/10"
                  }
                  ${
                    locked
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-white/20"
                  }
                `}
              >
                <div className="text-base">
                  {c.id === "default" && "🐣"}
                  {c.id === "purple" && "🪄"}
                  {c.id === "galaxy" && "🌌"}
                </div>
                <div>{c.name}</div>
                {locked && (
                  <div className="text-[10px] text-red-300">Lv {c.level}</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Button */}
      <button
        className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-medium transition"
        onClick={() => chrome.storage.sync.set({ xp: 0 })}
      >
        Reset XP
      </button>
    </div>
  );
}
