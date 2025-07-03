document.addEventListener('DOMContentLoaded', () => {
    const contentGrid = document.querySelector('.content-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');

    const parseFrontMatter = (text) => {
        const frontMatterRegex = /^---([\s\S]*?)---/;
        const match = frontMatterRegex.exec(text);
        
        const content = text.replace(frontMatterRegex, '').trim();
        const frontMatter = {};

        if (match) {
            const yaml = match[1];
            yaml.trim().split('\n').forEach(line => {
                const [key, ...value] = line.split(':');
                if (key && value) {
                    frontMatter[key.trim()] = value.join(':').trim();
                }
            });
        }
        
        return { frontMatter, content };
    };

    const loadContent = async () => {
        try {
            const response = await fetch('_data/content_manifest.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const manifest = await response.json();

            contentGrid.innerHTML = '';

            const allFiles = [
                ...manifest.poems.map(file => ({ type: 'poem', path: `content/poems/${file}` })),
                ...manifest.lyrics.map(file => ({ type: 'lyric', path: `content/lyrics/${file}` }))
            ];

            for (const fileInfo of allFiles) {
                const fileResponse = await fetch(fileInfo.path);
                if (!fileResponse.ok) {
                    console.warn(`Could not load ${fileInfo.path}`);
                    continue;
                }
                const text = await fileResponse.text();
                const { frontMatter, content } = parseFrontMatter(text);

                const item = document.createElement('div');
                item.classList.add('content-item');
                item.dataset.category = frontMatter.category || fileInfo.type;

                const title = document.createElement('h3');
                title.textContent = frontMatter.title || '无标题';

                const pre = document.createElement('pre');
                pre.textContent = content;

                item.appendChild(title);
                item.appendChild(pre);
                contentGrid.appendChild(item);
            }
        } catch (error) {
            console.error('Error loading content:', error);
            contentGrid.innerHTML = '<p>内容加载失败，请稍后重试。</p>';
        }
    };

    document.addEventListener('DOMContentLoaded', () => {
        const filterButtons = document.querySelectorAll('.filter-btn');

        const filterContent = (filter) => {
            const items = document.querySelectorAll('.content-item');
            items.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                filterContent(filter);
            });
        });
    });

    loadContent();
});