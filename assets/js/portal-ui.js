/**
 * Shared UI: mobile-friendly nav menu, ripple, modals
 */
export function initPortalNavMenu(options = {}) {
    const btn = document.getElementById(options.triggerId || "navMenuBtn");
    const panel = document.getElementById(options.panelId || "navMenuDropdown");
    const backdrop = document.getElementById(options.backdropId || "navMenuBackdrop");
    if (!btn || !panel) return;

    if (btn.dataset.portalNavBound === "1") return;
    btn.dataset.portalNavBound = "1";

    panel.classList.remove("hidden");
    if (backdrop) backdrop.classList.remove("hidden");

    /** Fixed menus must be on body — avoids clip/transform bugs on mobile */
    if (backdrop && backdrop.parentElement !== document.body) {
        document.body.appendChild(backdrop);
    }
    if (panel.parentElement !== document.body) {
        document.body.appendChild(panel);
    }

    const isMobile = () => window.matchMedia("(max-width: 639px)").matches;

    const positionPanel = () => {
        if (isMobile()) {
            panel.style.top = "";
            panel.style.right = "";
            panel.style.left = "";
            panel.style.bottom = "";
            return;
        }
        const rect = btn.getBoundingClientRect();
        const gap = 8;
        panel.style.top = `${Math.round(rect.bottom + gap)}px`;
        panel.style.right = `${Math.round(Math.max(12, window.innerWidth - rect.right))}px`;
        panel.style.left = "auto";
        panel.style.bottom = "auto";
    };

    const isOpen = () => panel.classList.contains("is-open");

    const setOpen = (open) => {
        if (open) positionPanel();
        panel.classList.toggle("is-open", open);
        panel.setAttribute("aria-hidden", open ? "false" : "true");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (backdrop) {
            backdrop.classList.toggle("is-open", open);
            backdrop.setAttribute("aria-hidden", open ? "false" : "true");
        }
        document.body.classList.toggle("portal-menu-open", open && isMobile());
    };

    const close = () => setOpen(false);
    let ignoreOutsideClick = false;

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        ignoreOutsideClick = true;
        setOpen(!isOpen());
        setTimeout(() => {
            ignoreOutsideClick = false;
        }, 0);
    });

    if (backdrop) {
        backdrop.addEventListener("click", close);
    }

    document.addEventListener("click", (e) => {
        if (ignoreOutsideClick || !isOpen()) return;
        if (panel.contains(e.target) || btn.contains(e.target)) return;
        close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen()) close();
    });

    window.addEventListener("resize", () => {
        if (isOpen()) positionPanel();
    });

    panel.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.target.closest("#openProfileEditBtn, #logoutBtn, a[href]")) {
            close();
        }
    });
}

export function initRipple(selector = ".portal-ripple-host, .portal-btn") {
    document.querySelectorAll(selector).forEach((el) => {
        if (el.dataset.rippleBound === "1") return;
        el.dataset.rippleBound = "1";
        if (!el.classList.contains("portal-ripple-host")) {
            el.classList.add("portal-ripple-host");
        }

        el.addEventListener("pointerdown", (e) => {
            if (el.disabled || el.getAttribute("aria-disabled") === "true") return;

            const rect = el.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height) * 1.2;
            const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
            const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

            const ripple = document.createElement("span");
            ripple.className = "portal-ripple";
            if (el.classList.contains("portal-btn-light") || el.classList.contains("bg-white")) {
                ripple.classList.add("portal-ripple--dark");
            }
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            el.appendChild(ripple);
            ripple.addEventListener("animationend", () => ripple.remove());
        });
    });
}

export function initModalAnimations() {
    document.querySelectorAll("#shareModal, #profileModal, #editModal").forEach((modal) => {
        if (!modal.classList.contains("portal-modal-backdrop")) {
            modal.classList.add("portal-modal-backdrop");
        }
        const inner = modal.querySelector(":scope > div");
        if (inner && !inner.classList.contains("portal-modal-panel")) {
            inner.classList.add("portal-modal-panel");
        }
    });
}

export function initNavScrollShadow(navSelector = "nav") {
    const nav = document.querySelector(navSelector);
    if (!nav) return;
    nav.classList.add("portal-nav-root");
    const onScroll = () => {
        nav.classList.toggle("portal-nav-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

export function initPortalUI() {
    initPortalNavMenu();
    initRipple();
    initModalAnimations();
    initNavScrollShadow();
    document.body.classList.add("portal-page-enter");
}

export function refreshPortalUI() {
    initPortalNavMenu();
    initRipple();
}

if (typeof window !== "undefined") {
    window.initPortalUI = initPortalUI;
    window.refreshPortalUI = refreshPortalUI;
    window.initPortalNavMenu = initPortalNavMenu;
}
