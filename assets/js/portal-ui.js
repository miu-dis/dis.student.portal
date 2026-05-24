/**
 * Shared UI: mobile-friendly nav menu, ripple, modals, stagger grids
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

    const isOpen = () => panel.classList.contains("is-open");

    const setOpen = (open) => {
        panel.classList.toggle("is-open", open);
        panel.setAttribute("aria-hidden", open ? "false" : "true");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        if (backdrop) {
            backdrop.classList.toggle("is-open", open);
            backdrop.setAttribute("aria-hidden", open ? "false" : "true");
        }
        document.body.classList.toggle("portal-menu-open", open);
    };

    const close = () => setOpen(false);
    const toggle = () => setOpen(!isOpen());

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggle();
    });

    if (backdrop) {
        backdrop.addEventListener("click", close);
    }

    document.addEventListener("click", (e) => {
        if (!isOpen()) return;
        if (panel.contains(e.target) || btn.contains(e.target)) return;
        close();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && isOpen()) close();
    });

    panel.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.target.closest("button, a[href]") && !e.target.closest("select")) {
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
    document.querySelectorAll("#shareModal, #profileModal").forEach((modal) => {
        modal.classList.add("portal-modal-backdrop");
        const inner = modal.querySelector(":scope > div");
        if (inner) inner.classList.add("portal-modal-panel");
    });
}

export function initNavScrollShadow(navSelector = "nav") {
    const nav = document.querySelector(navSelector);
    if (!nav) return;
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

/** Call after dynamic HTML (e.g. login buttons in nav) */
export function refreshPortalUI() {
    initPortalNavMenu();
    initRipple();
}

if (typeof window !== "undefined") {
    window.initPortalUI = initPortalUI;
    window.refreshPortalUI = refreshPortalUI;
    window.initPortalNavMenu = initPortalNavMenu;
}
