
function generateWaifu(type) {
  const image = document.getElementById("waifuImage");
  const urls = {
    chibi: "https://api.waifu.pics/sfw/waifu",
    mature: "https://api.waifu.pics/nsfw/waifu",
    hybrid: "https://api.waifu.pics/sfw/neko"
  };

  fetch(urls[type])
    .then(res => res.json())
    .then(data => {
      image.src = data.url;
    })
    .catch(err => console.error("Error loading waifu:", err));
}
