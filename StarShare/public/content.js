document.addEventListener("DOMContentLoaded", () => {

  const XP_RUN = 10;
  const XP_FOCUS = 15;
  const FOCUS_INTERVAL = 300;

  //  XP rules
  const XP_ENTER_SITE = 10;       // When user enters site
  const XP_ACTIVE_INTERVAL = 30;  // Seconds per XP tick
  const XP_ACTIVE_REWARD = 5;     // XP per active interval
  const XP_5_MIN = 25;            // Bonus after 5 minutes (300 seconds)

  let siteEntered = false;
  let totalActiveSeconds = 0;

  function injectBuddy() {
    if (document.getElementById("starshare-buddy")) return;

    const buddy = document.createElement("div");
    buddy.id = "starshare-buddy";
    Object.assign(buddy.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "65px",
      height: "65px",
      background: "#6366F1",
      color: "white",
      fontSize: "28px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      cursor: "pointer",
      zIndex: 999999,
    });
    buddy.textContent = "⭐";
    document.body.appendChild(buddy);
  }
  injectBuddy();

  // Toast
  function showToast(text) {
    const t = document.createElement("div");
    t.textContent = text;
    Object.assign(t.style, {
      position: "fixed",
      right: "20px",
      bottom: "120px",
      padding: "8px 12px",
      background: "rgba(0,0,0,0.75)",
      color: "white",
      borderRadius: "8px",
      zIndex: 999999,
      transition: "0.8s",
    });
    document.body.appendChild(t);
    setTimeout(() => {
      t.style.opacity = "0";
      t.style.transform = "translateY(-20px)";
    }, 200);
    setTimeout(() => t.remove(), 1500);
  }

  // XP System
  function addXP(amount) {
    chrome.storage.sync.get({ xp: 0 }, (res) => {
      const newXP = res.xp + amount;
      chrome.storage.sync.set({ xp: newXP });
      showToast(`+${amount} XP`);
      try { chrome.runtime.sendMessage({ type: "xp_update", xp: newXP }); } catch {}
    });
  }

  // Run Button Detection
  function bindRunButtons() {
    const selectors = [
      "button",
      "input[type='button']",
      "[role='button']",
      "[aria-label='Run']",
      "[data-cy='run-code-btn']",
      "[data-cy='submit-btn']"
    ];

    const candidates = document.querySelectorAll(selectors.join(","));

    const buttons = [...candidates].filter(btn => {
      const t = (btn.innerText || btn.value || "").toLowerCase().trim();
      return ["run", "submit", "execute", "play"].some(word => t.includes(word));
    });

    buttons.forEach(btn => {
      if (btn.dataset.starshareBound) return;
      btn.dataset.starshareBound = "1";

      btn.addEventListener("click", () => {
        addXP(XP_RUN);
      });
    });
  }

  bindRunButtons();

  const observer = new MutationObserver(() => bindRunButtons());
  observer.observe(document.body, { childList: true, subtree: true });

  // Focus XP
  let activeSeconds = 0;
  setInterval(() => {
    if (document.visibilityState === "visible") activeSeconds++;
    if (activeSeconds > 0 && activeSeconds % FOCUS_INTERVAL === 0) {
      addXP(XP_FOCUS);
    }
  }, 1000);

  // Completion XP
  function detectProblemCompletion() {
    const successWords = ["accepted", "all tests passed", "congratulations"];
    const text = document.body.innerText.toLowerCase();

    if (!document.body.dataset.starshareCompleted &&
      successWords.some(s => text.includes(s))) {
      document.body.dataset.starshareCompleted = "1";
      addXP(25);
    }
  }

  setInterval(detectProblemCompletion, 2000);

  // XP When Entering Site

  if (!siteEntered) {
    siteEntered = true;
    addXP(XP_ENTER_SITE);
  }


  // XP Every 30 Seconds of Active Use

  let intervalCounter = 0;

  setInterval(() => {
    if (document.visibilityState === "visible") {
      intervalCounter++;
      totalActiveSeconds++;

      // Every 30s -> +5 XP
      if (intervalCounter % XP_ACTIVE_INTERVAL === 0) {
        addXP(XP_ACTIVE_REWARD);
      }

      // After 5 minutes -> +25 XP bonus
      if (totalActiveSeconds === 300) {
        addXP(XP_5_MIN);
      }
    }
  }, 1000);

});
