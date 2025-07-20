const waifus = [
  'waifus/waifu1.jpg',
  'waifus/waifu2.jpg',
  'waifus/waifu3.jpg',
  'waifus/waifu4.jpg',
  'waifus/waifu5.jpg'
];
function generateWaifu() {
  const img = document.getElementById('waifuImage');
  const index = Math.floor(Math.random() * waifus.length);
  img.src = waifus[index];
}