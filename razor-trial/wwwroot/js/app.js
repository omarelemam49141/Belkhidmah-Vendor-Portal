(function () {
  const motion = document.documentElement.dataset.motion || "lite";

  document.body.addEventListener("htmx:configRequest", (event) => {
    const token = document.querySelector('input[name="__RequestVerificationToken"]');
    if (token instanceof HTMLInputElement && token.value) {
      event.detail.headers["RequestVerificationToken"] = token.value;
    }
  });

  document.body.addEventListener("htmx:afterSwap", (event) => {
    const alpine = window.Alpine;
    const el = event.detail?.elt;
    if (alpine && el instanceof Element) {
      alpine.initTree(el);
    }
  });

  function runSplash() {
    const splash = document.querySelector("[data-splash]");
    if (!splash || typeof gsap === "undefined") return;

    if (motion === "none") {
      splash.remove();
      return;
    }

    const hold = motion === "full" ? 1.15 : 0.45;
    const fade = motion === "full" ? 0.55 : 0.28;

    gsap.timeline()
      .set(splash, { autoAlpha: 1 })
      .to(splash, {
        autoAlpha: 0,
        duration: fade,
        delay: hold,
        ease: "power2.out",
        onComplete: () => splash.remove()
      });
  }

  function runPageIn() {
    if (typeof gsap === "undefined" || motion === "none") return;
    const visual = document.querySelector("[data-enter-visual]");
    const panel = document.querySelector("[data-enter-panel]");
    if (!visual && !panel) return;

    const splashEl = document.querySelector("[data-splash]");
    const delay = splashEl && motion === "full" ? 1.4 : 0.08;

    if (visual) {
      gsap.from(visual, {
        opacity: 0,
        y: 18,
        duration: 0.7,
        delay,
        ease: "power3.out"
      });
    }
    if (panel) {
      gsap.from(panel, {
        opacity: 0,
        y: 28,
        duration: 0.75,
        delay: delay + 0.12,
        ease: "power3.out"
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      runSplash();
      runPageIn();
    });
  } else {
    runSplash();
    runPageIn();
  }
})();
