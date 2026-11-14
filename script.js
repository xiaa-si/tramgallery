/* -------------------------------------------------
   script.js – theme toggle, tooltip hover cards,
   and smooth scrolling for internal links.
   ------------------------------------------------- */
(function() {
    'use strict';

    /* ---------- Theme toggle (unchanged) ---------- */
    const toggleBtn = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function getInitialTheme() {
        const saved = localStorage.getItem('theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    applyTheme(getInitialTheme());

    toggleBtn.addEventListener('click', function() {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    /* ---------- Tooltip hover‑over cards ---------- */
    const tooltip = document.getElementById('tooltip');
    const items = document.querySelectorAll('.item');

    // Helper to show tooltip
    function showTooltip(e) {
        const desc = this.getAttribute('data-desc');
        if (!desc) return;
        tooltip.textContent = desc;
        tooltip.setAttribute('aria-hidden', 'false');
        tooltip.style.opacity = '1';
        positionTooltip(e);
    }

    // Helper to hide tooltip
    function hideTooltip() {
        tooltip.style.opacity = '0';
        tooltip.setAttribute('aria-hidden', 'true');
    }

    // Position tooltip near the mouse, keeping it inside viewport
    function positionTooltip(e) {
        const padding = 8; // space from cursor
        const tooltipRect = tooltip.getBoundingClientRect();
        let left = e.clientX + padding;
        let top = e.clientY + padding;

        // Prevent overflow on right/bottom
        if (left + tooltipRect.width > window.innerWidth) {
            left = e.clientX - tooltipRect.width - padding;
        }
        if (top + tooltipRect.height > window.innerHeight) {
            top = e.clientY - tooltipRect.height - padding;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    }

    // Attach listeners to each gallery item
    items.forEach(item => {
        item.addEventListener('mouseenter', showTooltip);
        item.addEventListener('mouseleave', hideTooltip);
        item.addEventListener('mousemove', positionTooltip);
        // Keyboard accessibility – show on focus, hide on blur
        item.addEventListener('focus', showTooltip);
        item.addEventListener('blur', hideTooltip);
    });

    /* ---------- Smooth scrolling for internal links ---------- */
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (!target) return;
        const hash = target.getAttribute('href');
        const destination = document.querySelector(hash);
        if (destination) {
            e.preventDefault();
            destination.scrollIntoView({ behavior: 'smooth' });
            // Update URL hash without jumping
            history.pushState(null, '', hash);
        }
    });
})();
