// JavaScript for the image viewer 

document.addEventListener('DOMContentLoaded', () => {
    const viewerContainer = document.getElementById('image-viewer-container');
    if (!viewerContainer) return;

    const viewerImage = document.getElementById('viewer-image-element');
    const viewerCaption = document.getElementById('viewer-caption');
    const closeBtn = document.querySelector('.close-viewer');
    const nextBtn = document.querySelector('.next-image');
    const prevBtn = document.querySelector('.prev-image');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length === 0) return;

    let currentIndex = 0;
    let touchStartX = 0;

    const preloadImage = (index) => {
        if (index >= 0 && index < galleryItems.length) {
            const img = new Image();
            img.src = galleryItems[index].src;
        }
    };

    const showImage = (index) => {
        currentIndex = (index + galleryItems.length) % galleryItems.length;
        const item = galleryItems[currentIndex];
        
        viewerImage.src = item.src;
        viewerCaption.textContent = item.alt || '';

        // Preload next and previous images for a smoother experience
        preloadImage(currentIndex + 1);
        preloadImage(currentIndex - 1);
    };

    const openViewer = (index) => {
        showImage(index);
        viewerContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeViewer = () => {
        viewerContainer.classList.remove('active');
        document.body.style.overflow = '';
    };

    const handleNext = () => showImage(currentIndex + 1);
    const handlePrev = () => showImage(currentIndex - 1);

    // --- Event Listeners ---
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openViewer(index));
    });

    closeBtn.addEventListener('click', closeViewer);
    nextBtn.addEventListener('click', handleNext);
    prevBtn.addEventListener('click', handlePrev);

    viewerContainer.addEventListener('click', (e) => {
        if (e.target === viewerContainer) {
            closeViewer();
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!viewerContainer.classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === 'l') handleNext();
        if (e.key === 'ArrowLeft' || e.key === 'h') handlePrev();
        if (e.key === 'Escape') closeViewer();
    });

    // Touch Swipe Navigation
    viewerContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewerContainer.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const deltaX = touchEndX - touchStartX;
        if (deltaX > 50) { // Swipe Right
            handlePrev();
        } else if (deltaX < -50) { // Swipe Left
            handleNext();
        }
    });
}); 