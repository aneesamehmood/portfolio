const text = "hi, aneesa here.";
const el = document.getElementById("hero-text");
let i = 0;

const heroText = document.getElementById('hero-text');
heroText.innerHTML = '&nbsp;'; // Reserve space

function typeChar() {
  if (i <= text.length) {
    el.innerText = text.slice(0, i);
    i++;
    setTimeout(typeChar, 80);
  }
}

window.addEventListener("DOMContentLoaded", typeChar);
