/* =============================================================
   SCROLL REVEAL
   keisuke-portfolio / js/scroll-reveal.js

   Observes elements with class .reveal or .scroll-reveal and
   adds .visible / .active when they enter the viewport.
   ============================================================= */

(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible', 'active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .scroll-reveal').forEach((el) => {
    observer.observe(el);
  });
})();
