const generateBtn = document.getElementById('generate-btn');
const waifuImg = document.getElementById('waifu-img');
const filters = document.querySelectorAll('input[name="style"]');

// Placeholder fallback
const fallbackImg = 'images/placeholder1.jpg';

// API endpoints based on filter
const API_BASE = "https://api.waifu.pics/sfw/";
const getEndpoint = (style) => {
  switch (style) {
    case 'chibi': return "waifu";
    case 'mature': return "neko"; // closest we can use from public API
    case 'hybrid': return "shinobu"; // fun hybrid anime
    default: return "waifu";
  }
};

generateBtn.addEventListener('click', () => {
  const selected = document.querySelector('input[name="style"]:checked').value;
  const endpoint = getEndpoint(selected);

  fetch(`${API_BASE}${endpoint}`)
    .then(res => res.json())
    .then(data => {
      waifuImg.src = data.url;
    })
    .catch(() => {
      waifuImg.src = fallbackImg;
    });
});
