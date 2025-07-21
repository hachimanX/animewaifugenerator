
class WaifuGenerator {
    constructor() {
        this.apiEndpoints = {
            waifu: 'https://api.waifu.pics/sfw/waifu',
            maid: 'https://api.waifu.pics/sfw/waifu',
            neko: 'https://api.waifu.pics/sfw/neko',
            bunny: 'https://api.waifu.pics/sfw/waifu',
            school: 'https://api.waifu.pics/sfw/waifu',
            uniform: 'https://api.waifu.pics/sfw/waifu',
            casual: 'https://api.waifu.pics/sfw/waifu',
            fantasy: 'https://api.waifu.pics/sfw/waifu',
            ecchi: 'https://api.waifu.pics/nsfw/waifu'
        };
        
        this.currentImageUrl = '';
        this.isGenerating = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.generateWaifu(); // Generate initial waifu
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-btn');
        const downloadBtn = document.getElementById('download-btn');
        const shareBtn = document.getElementById('share-btn');
        const waifuImage = document.getElementById('waifu-image');

        generateBtn.addEventListener('click', () => this.generateWaifu());
        downloadBtn.addEventListener('click', () => this.downloadImage());
        shareBtn.addEventListener('click', () => this.shareImage());
        
        waifuImage.addEventListener('load', () => this.onImageLoad());
        waifuImage.addEventListener('error', () => this.onImageError());

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        document.querySelectorAll('.crypto-address').forEach(address => {
            address.addEventListener('click', () => this.copyToClipboard(address.textContent));
        });
    }

    async generateWaifu() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        this.showLoading();
        
        const category = document.getElementById('waifu-category').value;
        const style = document.getElementById('art-style').value;
        
        try {
            const endpoint = this.getApiEndpoint(category, style);
            const response = await fetch(endpoint);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.url) {
                this.currentImageUrl = data.url;
                const waifuImage = document.getElementById('waifu-image');
                waifuImage.src = this.currentImageUrl;
            } else {
                throw new Error('No image URL in response');
            }
            
        } catch (error) {
            console.error('Error generating waifu:', error);
            this.showError('Failed to generate waifu. Please try again!');
        }
    }

    getApiEndpoint(category, style) {
        let endpoint = this.apiEndpoints[category] || this.apiEndpoints.waifu;
        
        endpoint += '?t=' + Date.now();
        
        return endpoint;
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const downloadBtn = document.getElementById('download-btn');
        const shareBtn = document.getElementById('share-btn');
        
        loadingOverlay.classList.remove('hidden');
        downloadBtn.style.display = 'none';
        shareBtn.style.display = 'none';
        
        const loadingMessages = [
            'Generating your perfect waifu...',
            'Summoning anime magic...',
            'Creating your dream character...',
            'Channeling kawaii energy...',
            'Crafting anime perfection...'
        ];
        
        const loadingText = document.querySelector('.loading-text');
        loadingText.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.add('hidden');
        this.isGenerating = false;
    }

    onImageLoad() {
        this.hideLoading();
        const downloadBtn = document.getElementById('download-btn');
        const shareBtn = document.getElementById('share-btn');
        
        downloadBtn.style.display = 'flex';
        shareBtn.style.display = 'flex';
        
        const waifuContainer = document.querySelector('.waifu-container');
        waifuContainer.style.animation = 'none';
        waifuContainer.offsetHeight; // Trigger reflow
        waifuContainer.style.animation = 'successPulse 0.6s ease-out';
    }

    onImageError() {
        this.hideLoading();
        this.showError('Failed to load image. Please try again!');
    }

    showError(message) {
        const loadingText = document.querySelector('.loading-text');
        loadingText.textContent = message;
        loadingText.style.color = '#ff4757';
        
        setTimeout(() => {
            loadingText.style.color = '#ff6b9d';
        }, 3000);
    }

    async downloadImage() {
        if (!this.currentImageUrl) return;
        
        try {
            const response = await fetch(this.currentImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `waifu-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showNotification('Image downloaded successfully! 📥');
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Download failed. Please try again! ❌');
        }
    }

    shareImage() {
        if (!this.currentImageUrl) return;
        
        if (navigator.share) {
            navigator.share({
                title: 'Check out my generated anime waifu!',
                text: 'I just generated this amazing anime waifu using the Anime Waifu Generator!',
                url: window.location.href
            }).catch(console.error);
        } else {
            const shareUrl = `${window.location.href}?share=${encodeURIComponent(this.currentImageUrl)}`;
            this.copyToClipboard(shareUrl);
            this.showNotification('Share link copied to clipboard! 📋');
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard! 📋');
            }).catch(() => {
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Copied to clipboard! 📋');
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        
        document.body.removeChild(textArea);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b9d, #c44569);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    new WaifuGenerator();
});

document.addEventListener('keydown', (e) => {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.keyCode === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 10000);
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);
