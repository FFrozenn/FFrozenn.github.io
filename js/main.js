// Main JavaScript file 

document.addEventListener('DOMContentLoaded', () => {
    // --- Data & Configuration ---
    // The 'translations' object is expected to be loaded from translations.js
    const navLinks = [
        { href: "index.html", key: "home" },
        { href: "tuan-intro.html", key: "tuanIntro" },
        { href: "xi-intro.html", key: "xiIntro" },
        { href: "comics.html", key: "comics" },
        { href: "novel.html", key: "novel" },
        { href: "poems-lyrics.html", key: "poemsLyrics" },
        { href: "diary.html", key: "diary" },
        { href: "drafts.html", key: "drafts" },
        { href: "videos.html", key: "videos" },
    ];

    const socialLinks = [
        { href: "https://x.com/FFrozenn1928", icon: "assets/icons/推特.png", title: "Twitter" },
        { href: "https://www.youtube.com/@FFrozenn1928", icon: "assets/icons/youtube (1).png", title: "YouTube" },
        { href: "https://space.bilibili.com/282390161", icon: "assets/icons/bilibili-copy.png", title: "哔哩哔哩" },
        { href: "https://weibo.com/u/7534676328", icon: "assets/icons/微博.png", title: "微博" },
        { href: "https://www.xiaohongshu.com/user/profile/65473f2400000000060057eb", icon: "assets/icons/小红书-copy.png", title: "小红书" }
    ];

    let currentLang = localStorage.getItem('lang') || 'zh';

    // --- DOM Elements ---
    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');

    /**
     * Loads header and footer content
     */
    const loadHeaderFooter = () => {
        if (header) {
            header.innerHTML = `
                <div class="logo">
                    <a href="index.html" data-lang-key="siteTitle"></a>
                </div>
                <nav class="main-nav">
                    <ul>
                        ${navLinks.map(link => `<li><a href="${link.href}" data-lang-key="${link.key}"></a></li>`).join('')}
                    </ul>
                </nav>
                <div class="lang-switch">
                    <button id="lang-btn-zh" class="lang-btn ${currentLang === 'zh' ? 'active' : ''}">中</button>
                    <button id="lang-btn-en" class="lang-btn ${currentLang === 'en' ? 'active' : ''}">EN</button>
                    <button id="lang-btn-ja" class="lang-btn ${currentLang === 'ja' ? 'active' : ''}">JA</button>
                </div>
                <button class="mobile-nav-toggle" aria-label="Open navigation">
                    <span class="hamburger"></span>
                </button>
            `;
        }

        if (footer) {
            footer.innerHTML = `
                <div class="social-links">
                    ${socialLinks.map(link => `<a href="${link.href}" target="_blank" rel="noopener noreferrer" title="${link.title}"><img src="${link.icon}" alt="${link.title}"></a>`).join('')}
                </div>
            `;
        }
    };

    /**
     * Updates UI text based on the current language
     */
    const updateText = () => {
        if (typeof translations === 'undefined') {
            console.error('Translations object not found. Make sure translations.js is loaded.');
            return;
        }
        const langPack = translations[currentLang];
        if (!langPack) return;

        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (langPack[key]) {
                element.textContent = langPack[key];
            }
        });
        document.documentElement.lang = currentLang.startsWith('zh') ? 'zh-CN' : currentLang;
    };

    const setupLangSwitch = () => {
        const langContainer = document.querySelector('.lang-switch');
        if (!langContainer) return;

        langContainer.addEventListener('click', (e) => {
            if (e.target.matches('.lang-btn')) {
                const lang = e.target.id.split('-')[2];
                currentLang = lang;
                localStorage.setItem('lang', lang);
                updateText();
    
                document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    /**
     * Initializes video player controls if they exist on the page.
     */
    const initVideoPlayer = () => {
        const video = document.querySelector('.background-video');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const muteUnmuteBtn = document.getElementById('mute-unmute-btn');

        if (!video || !playPauseBtn || !muteUnmuteBtn) return;

        const updatePlayPause = () => {
            playPauseBtn.textContent = video.paused ? '▶' : '❚❚';
        };

        const updateMute = () => {
            muteUnmuteBtn.textContent = video.muted ? '🔇' : '🔊';
        };

        playPauseBtn.addEventListener('click', () => {
            video.paused ? video.play() : video.pause();
        });

        muteUnmuteBtn.addEventListener('click', () => {
            video.muted = !video.muted;
        });

        video.addEventListener('play', updatePlayPause);
        video.addEventListener('pause', updatePlayPause);
        video.addEventListener('volumechange', updateMute);

        updatePlayPause();
        updateMute();
    };

    /**
     * Toggles the mobile navigation menu.
     */
    const initMobileNav = () => {
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        const mainNav = document.querySelector('.main-nav');

        if (!toggleBtn || !mainNav) return;

        toggleBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            toggleBtn.classList.toggle('active');
        });
    };

    /**
     * Initializes filter controls if they exist on the page.
     */
    const initFilterControls = () => {
        const filterContainer = document.querySelector('.filter-controls');
        if (!filterContainer) return;

        const contentItems = document.querySelectorAll('.content-item');
        if (contentItems.length === 0) return;

        filterContainer.addEventListener('click', (e) => {
            const target = e.target;
            if (!target.matches('.filter-btn')) return;

            // Update active button state
            filterContainer.querySelector('.filter-btn.active').classList.remove('active');
            target.classList.add('active');

            const filterValue = target.getAttribute('data-filter');

            // Show/hide content items
            contentItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    };

    // --- Script Initialization ---
    loadHeaderFooter();
    updateText();
    setupLangSwitch();
    initVideoPlayer();
    initMobileNav();
    initFilterControls();
}); 