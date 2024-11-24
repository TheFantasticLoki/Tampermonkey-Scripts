// ==UserScript==
// @name         Reddit Image Gallery Arrow Navigation
// @namespace    https://reddit.com
// @version      1.9
// @description  Navigate Reddit image galleries using arrow keys, made with the help of ChatGPT, Thanks ChatGPT!
// @author       TheFantasticLoki
// @match        https://*.reddit.com/*
// @grant        none
// @license      MIT
// @homepage     https://github.com/
// @homepageURL  https://github.com/
// @supportURL   https://github.com/
// @downloadURL  https://raw.githubusercontent.com/
// @updateURL    https://raw.githubusercontent.com/
// ==/UserScript==

(function () {
    'use strict';

    let activeGallery = null;

    const simulateClick = (button) => {
        if (button) {
            try {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                });
                button.dispatchEvent(event);
                console.log('Dispatched click event successfully');
            } catch (err) {
                console.error('Error dispatching click event:', err);
            }
        } else {
            console.log('Button not interactable or not found.');
        }
    };

    const handleKeyDown = (e) => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (!activeGallery) {
            console.log('No active gallery to navigate.');
            return;
        }

        if (e.key === 'ArrowLeft') {
            console.log('Left arrow pressed');
            const prevButton = activeGallery.querySelector('button[aria-label="Previous page"]');
            console.log('Previous Button:', prevButton);
            simulateClick(prevButton);
        }

        if (e.key === 'ArrowRight') {
            console.log('Right arrow pressed');
            const nextButton = activeGallery.querySelector('button[aria-label="Next page"]');
            console.log('Next Button:', nextButton);
            simulateClick(nextButton);
        }
    };

    const handleMouseEnter = (e) => {
        const galleryCarousel = e.currentTarget;
        if (galleryCarousel && galleryCarousel.shadowRoot) {
            activeGallery = galleryCarousel.shadowRoot;
            console.log('Mouse entered gallery-carousel. Active gallery set:', activeGallery);
        }
    };

    const handleMouseLeave = () => {
        activeGallery = null;
        console.log('Mouse left gallery-carousel. Active gallery cleared.');
    };

    const detectPopup = () => {
        const lightbox = document.querySelector('#shreddit-media-lightbox');
        if (lightbox) {
            const gallery = lightbox.querySelector('gallery-carousel');
            if (gallery && gallery.shadowRoot) {
                activeGallery = gallery.shadowRoot;
                console.log('Gallery popup detected. Active gallery set:', activeGallery);
            }
        }
    };

    const observeDOMChanges = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.id === 'shreddit-media-lightbox') {
                            console.log('Lightbox detected:', node);
                            detectPopup();
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    const attachHoverListeners = () => {
        document.querySelectorAll('gallery-carousel').forEach((carousel) => {
            carousel.addEventListener('mouseenter', handleMouseEnter);
            carousel.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    const observeFeed = () => {
        const feedObserver = new MutationObserver(() => {
            attachHoverListeners(); // Reattach listeners as new galleries load
        });

        feedObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Initial setup
    document.addEventListener('keydown', handleKeyDown);
    observeDOMChanges();
    observeFeed();

    // Attach listeners for initial galleries
    attachHoverListeners();

    console.log('Script initialized.');
})();
