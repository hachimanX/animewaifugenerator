
class WaifuGenerator {
    constructor() {
        this.availableCategories = [];
        this.currentImageUrl = '';
        this.isGenerating = false;
        this.init();
    }

    async init() {
        await this.fetchAvailableCategories();
        this.populateCategoryDropdown();
        this.bindEvents();
        this.generateWaifu(); // Generate initial waifu
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-btn');
        const shareBtn = document.getElementById('share-btn');
        const waifuImage = document.getElementById('waifu-image');

        generateBtn.addEventListener('click', () => this.generateWaifu());
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

    async fetchAvailableCategories() {
        try {
            this.availableCategories = [
                'waifu', 'neko', 'shinobu', 'megumin', 'bully', 'cuddle', 'cry', 'hug', 
                'awoo', 'kiss', 'lick', 'pat', 'smug', 'bonk', 'yeet', 'blush', 'smile', 
                'wave', 'highfive', 'handhold', 'nom', 'bite', 'glomp', 'slap', 'kill', 
                'kick', 'happy', 'wink', 'poke', 'dance', 'cringe'
            ];
        } catch (error) {
            console.error('Error fetching categories:', error);
            this.availableCategories = ['waifu', 'neko', 'shinobu', 'megumin'];
        }
    }

    populateCategoryDropdown() {
        const categorySelect = document.getElementById('waifu-category');
        if (!categorySelect) return;

        categorySelect.innerHTML = '';

        this.availableCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = this.formatCategoryName(category);
            categorySelect.appendChild(option);
        });
    }

    formatCategoryName(category) {
        const categoryNames = {
            'waifu': 'Random Waifu',
            'neko': 'Neko',
            'shinobu': 'Shinobu',
            'megumin': 'Megumin',
            'bully': 'Bully',
            'cuddle': 'Cuddle',
            'cry': 'Cry',
            'hug': 'Hug',
            'awoo': 'Awoo',
            'kiss': 'Kiss',
            'lick': 'Lick',
            'pat': 'Pat',
            'smug': 'Smug',
            'bonk': 'Bonk',
            'yeet': 'Yeet',
            'blush': 'Blush',
            'smile': 'Smile',
            'wave': 'Wave',
            'highfive': 'High Five',
            'handhold': 'Hand Hold',
            'nom': 'Nom',
            'bite': 'Bite',
            'glomp': 'Glomp',
            'slap': 'Slap',
            'kill': 'Kill',
            'kick': 'Kick',
            'happy': 'Happy',
            'wink': 'Wink',
            'poke': 'Poke',
            'dance': 'Dance',
            'cringe': 'Cringe'
        };
        return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1);
    }

    getApiEndpoint(category, style) {
        if (!this.availableCategories.includes(category)) {
            category = 'waifu'; // Default fallback
        }
        
        let endpoint = `https://api.waifu.pics/sfw/${category}`;
        endpoint += '?t=' + Date.now();
        
        return endpoint;
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const shareBtn = document.getElementById('share-btn');
        
        loadingOverlay.classList.remove('hidden');
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
        const shareBtn = document.getElementById('share-btn');
        
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
    createParticles();
    initAdvancedAnimations();
});

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    
    const particleCount = window.innerWidth < 768 ? 15 : 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 4;
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = Math.random() * 4 + 4;
        
        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-delay: ${delay}s;
            animation-duration: ${duration}s;
        `;
        
        container.appendChild(particle);
    }
}

function initAdvancedAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.generator-section, .pod-banner-section, .donation-section, .contact-banner-section').forEach(section => {
        observer.observe(section);
    });
    
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const waifuContainer = document.querySelector('.waifu-container');
        if (waifuContainer) {
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            waifuContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
    });
    
    let hue = 0;
    setInterval(() => {
        hue = (hue + 0.5) % 360;
        document.documentElement.style.setProperty('--dynamic-hue', hue);
    }, 100);
}

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
