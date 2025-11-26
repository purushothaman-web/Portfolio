(function() {
  'use strict';
  
  const loadingScreen = document.getElementById('loading-screen');

  const MIN_DISPLAY_TIME = 1500;
  const startTime = Date.now();

  const loaderProgress = document.querySelector('.loader-progress');
  const loaderText = document.querySelector('.loader-text');

  let progress = 0; // current displayed progress (0-100)
  let target = 0; // target progress to ease towards
  let rafId = null;

  function setProgress(p) {
    progress = p;
    if (loaderProgress) loaderProgress.style.width = Math.min(100, Math.round(progress)) + '%';
    if (loaderText) loaderText.textContent = `Loading — ${Math.min(100, Math.round(progress))}%`;
  }

  function animateProgress() {
    // ease progress toward target
    progress += (target - progress) * 0.12 + 0.1;
    if (progress > 99 && target >= 100) {
      setProgress(100);
      cancelAnimationFrame(rafId);
      rafId = null;
      return;
    }
    setProgress(progress);
    rafId = requestAnimationFrame(animateProgress);
  }

  // Hide loader while respecting minimum display time
  function hideLoadingScreen() {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);

    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          if (loadingScreen && loadingScreen.parentNode) loadingScreen.remove();
        }, 500);
      }
    }, remainingTime);
  }

  // Start a simulated progress until load event sets target to 100
  function startSimulatedProgress() {
    if (!rafId) {
      // start by moving to a visible baseline
      target = 60;
      animateProgress();
      // slowly nudge higher over time so it doesn't stall at 60
      setTimeout(() => { if (target < 90) target = 90; }, 1800);
    }
  }

  // When page finishes loading, push progress to 100 and then hide
  function onLoaded() {
    target = 100;
    // ensure animation reaches 100, then hide (hideLoadingScreen enforces MIN_DISPLAY_TIME)
    setTimeout(() => {
      hideLoadingScreen();
    }, 250);
  }

  // Start simulated progress immediately
  startSimulatedProgress();

  if (document.readyState === 'complete') {
    onLoaded();
  } else {
    window.addEventListener('load', onLoaded);
  }

  // Safety fallback in case load never fires
  setTimeout(() => {
    if (target < 100) {
      target = 100;
      setTimeout(hideLoadingScreen, 300);
    }
  }, 6000);
})();
