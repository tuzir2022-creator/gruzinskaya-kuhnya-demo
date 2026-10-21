/* Слой анимации для демо грузинской кухни: плавный скролл, заголовки по словам из-под маски, хачапури собирается слоями, волна строк меню.
   Библиотеки лежат на сайте (vendor/). Нет библиотек, «уменьшить движение» или сбой - сайт остаётся обычным, весь текст виден. */
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !window.gsap || !window.ScrollTrigger) return;
  try {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("m-on");

    if (window.Lenis && matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener("click", function (e) {
          var id = a.getAttribute("href"); if (id.length < 2) return;
          var t = document.querySelector(id); if (!t) return;
          e.preventDefault(); lenis.scrollTo(t, { offset: -72 });
        });
      });
    }

    document.querySelectorAll("main h1, main h2").forEach(function (h) {
      if (h.querySelector("*")) return;
      var text = h.textContent;
      h.setAttribute("aria-label", text);
      h.innerHTML = text.split(/( )/).map(function (w) {
        return w === " " || !w ? w : '<span class="m-w" aria-hidden="true"><i>' + w + "</i></span>";
      }).join("");
    });

    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero h1 .m-w > i", { yPercent: 110, duration: 1.1, stagger: 0.07 }, 0.1)
      .from(".hero .lead, .hero .cta, .hero .facts", { y: 24, opacity: 0, duration: 0.9, stagger: 0.12 }, 0.5)
      .from(".boat .crust", { scale: 0.6, opacity: 0, duration: 1, transformOrigin: "50% 50%" }, 0.3)
      .from(".boat .cheese", { scale: 0.5, opacity: 0, duration: 1, transformOrigin: "50% 50%" }, 0.55)
      .from(".boat .yolk", { scale: 0, opacity: 0, duration: 0.9, transformOrigin: "50% 50%" }, 0.9);

    document.querySelectorAll("main section h2").forEach(function (h) {
      var w = h.querySelectorAll(".m-w > i"); if (!w.length) return;
      gsap.from(w, { yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.05, scrollTrigger: { trigger: h, start: "top 88%" } });
    });
    gsap.utils.toArray(".sec-lead, .notice, .cat h3").forEach(function (el) {
      gsap.from(el, { y: 24, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" } });
    });
    gsap.utils.toArray(".dishes").forEach(function (box) {
      gsap.from(box.children, { y: 28, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.09, scrollTrigger: { trigger: box, start: "top 88%" } });
    });
    gsap.from(".cart", { y: 32, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".cart", start: "top 90%" } });

    addEventListener("load", function () { ScrollTrigger.refresh(); });
  } catch (err) {
    document.documentElement.classList.remove("m-on");
    if (window.gsap) gsap.set("main *", { clearProps: "all" });
    if (window.console) console.warn("motion.js:", err);
  }
})();
