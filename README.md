# StudyBuddy – Chrome Extension
### _Turn your coding time into XP, levels, and fun._

StudyBuddy is a Chrome extension built for a hackathon MVP that gamifies learning.  
It tracks your coding activity across major learning platforms and rewards you with XP, levels, and a friendly floating buddy.

---

##  Features (MVP)

###  1. XP System
Earn XP for:
- Running code  
- Time spent coding  
- 5-minute focus streaks  
- Completing problems  
- Entering supported learning sites  

###  2. Floating Buddy
- Appears on coding sites  
- Shows XP gained as floating toasts  
- Reacts to activity  
- Stays visible using MutationObserver  

###  3. Level System
- Level up every **100 XP**  
- (UI + cosmetics coming soon)

###  4. Multi-Site Support
Works on major learning platforms:
- LeetCode  
- Replit  
- Google Colab  
- EDX  
- Coursera  
- Codecademy  
- FreeCodeCamp  
- GeeksForGeeks  
- Khan Academy  
- W3Schools  
- MDN  
- Microsoft Learn  
- CodingBat  
…and more.

---

## How It Works
The extension injects a friendly “buddy” onto supported sites.  
It detects actions like **Run** and **Submit**, tracks coding activity, and awards XP in real time using `chrome.storage.sync`.

A popup UI will show:
- XP bar  
- Level  
- Buddy cosmetics  

---

##  Tech Stack
- Chrome Extension (Manifest V3)  
- JavaScript
- React + Vite (for popup UI)
- Tailwind CSS (styling)
- Content Scripts  
- chrome.storage  
- MutationObserver  

---

## Installation (Developer Mode)

1. Download or clone this repository
2. Navigate into the project:
   ```bash
   cd StarShare
   npm install
   npm run build
   ```

3. Open Chrome and go to: chrome://extensions

4. Enable Developer Mode

5. Click Load unpacked

6. Select the dist/ folder created after the build

7. Open any supported site and start coding 🎉

---

## 👥 Team
- Ayesha Dawodi — **built the core backend and frontend logic for the MVP**, XP System, Multi-Site Detection, Floating Buddy, UI/UX, and
(implemented XP tracking, Run button detection, multi-site support, floating buddy interactions, and designed/built the full extension UI/UX)
- **Alexander Nguyen - Gitbook documentation lead**
  (Make accessible and easy to read pages, record visuals for future reference)
- **Libby Ben-Eliyahu - Contributed to the early stages of the project by helping develop the core idea, defining the project’s direction, and shaping its initial vision.**
  


---





