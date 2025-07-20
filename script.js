const waifus = [
  'images/waifu1.jpg',
  'images/waifu2.jpg',
  'images/waifu3.jpg',
  'images/waifu4.jpg',
  'images/waifu5.jpg'
];

const img = document.getElementById('waifu-img');
const btn = document.getElementById('generate-btn');
const loader = document.getElementById('loader');

function showWaifu() {
  loader.classList.remove('hidden');
  const index = Math.floor(Math.random() * waifus.length);
  setTimeout(() => {
    img.src = waifus[index];
    loader.classList.add('hidden');
  }, 800);  // simulate load
}

btn.addEventListener('click', showWaifu);
document.addEventListener('DOMContentLoaded', showWaifu);
