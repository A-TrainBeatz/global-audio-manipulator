(async () => {
const url = 'https://raw.githubusercontent.com/A-TrainBeatz/global-audio-manipulator/main/audiomanipulator.js';
const res = await fetch(url);
const code = await res.text();
const s = document.createElement('script');
s.textContent = code;
document.documentElement.appendChild(s);
})();
