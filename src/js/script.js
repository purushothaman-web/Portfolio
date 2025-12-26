document.addEventListener("DOMContentLoaded", () => {
  // ====== MOBILE NAVBAR (SIDE DRAWER) ======
  const openMenuBtn = document.querySelector(".open-menu");
  const closeMenuBtn = document.getElementById("closeMenu");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const navOverlay = document.getElementById("navOverlay");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  const toggleDrawer = (isOpen) => {
    mobileDrawer.classList.toggle("active", isOpen);
    navOverlay.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  if (openMenuBtn) {
    openMenuBtn.addEventListener("click", () => toggleDrawer(true));
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", () => toggleDrawer(false));
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", () => toggleDrawer(false));
  }

  drawerLinks.forEach(link => {
    link.addEventListener("click", () => toggleDrawer(false));
  });

  // ====== THEME HANDLER (Blue / Dark only) ======
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "theme-blue";
  html.classList.add(savedTheme);

  const toggleButtons = document.querySelectorAll('[id^="radix-"]');
  const themeMenus = document.querySelectorAll(".theme-menu");

  toggleButtons.forEach((btn, index) => {
    const menu = themeMenus[index];
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
      themeMenus.forEach((m, i) => i !== index && m.classList.add("hidden"));
    });
  });

  document.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.dataset.theme;

      // Remove all themes (only blue & dark remain)
      html.classList.remove("theme-blue", "theme-dark");
      html.classList.add(selectedTheme);
      localStorage.setItem("theme", selectedTheme);

      // Hide all theme menus
      themeMenus.forEach((menu) => menu.classList.add("hidden"));
    });
  });

  document.addEventListener("click", () => {
    themeMenus.forEach((menu) => menu.classList.add("hidden"));
  });

  // ====== NOTYF INITIALIZATION ======
  const notyf = new Notyf({
    duration: 2000,
    position: { x: "right", y: "bottom" },
    ripple: true,
    dismissible: true,
  });



  // ====== CONTACT FORM HANDLER ======
  const form = document.querySelector(".contact-card");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const subject = document.getElementById("subject");
      const message = document.getElementById("message");

      let isValid = true;

      // Clear existing popups
      document.querySelectorAll(".error-popup").forEach((popup) => popup.remove());

      const showError = (input, msg) => {
        const popup = document.createElement("div");
        popup.classList.add("error-popup");
        popup.textContent = msg;
        input.parentElement.appendChild(popup);
        popup.style.display = "block";
        setTimeout(() => popup.remove(), 2000);
      };

      // Validation
      if (name.value.trim() === "") {
        showError(name, "Name is required");
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showError(email, "Enter a valid email");
        isValid = false;
      }

      if (subject.value.trim() === "") {
        showError(subject, "Subject is required");
        isValid = false;
      }

      if (message.value.trim() === "") {
        showError(message, "Message is required");
        isValid = false;
      }

      // Submit if valid
      if (isValid) {
        const formData = new FormData(form);

        try {
          const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            notyf.success("Message sent successfully! Thank you 🙌");
            form.reset();
          } else {
            throw new Error("Form submission failed");
          }
        } catch (error) {
          notyf.error("Oops! Something went wrong. Please try again.");
        }
      }
    });
  }

  // ====== DYNAMIC TYPING ANIMATION ======
  const typedElement = document.querySelector(".typed-role");
  if (typedElement && typeof Typed !== "undefined") {
    new Typed(".typed-role", {
      strings: [
        "Full-Stack MERN Developer",
        "Frontend Engineer (React)",
        "Backend Developer (Node & MongoDB)",
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      cursorChar: "|",
    });
  }

  // ====== SWIPER INITIALIZATION ======
  let swiper;
  let resizeTimeout;

  function initSwiper() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile && swiper) {
      swiper.destroy(true, true);
      swiper = null;
      return;
    }

    if (!isMobile && !swiper) {
      swiper = new Swiper(".achievement-swiper", {
        direction: "horizontal",
        slidesPerView: "auto",
        spaceBetween: 20,
        freeMode: true,
        navigation: {
          nextEl: ".next-achievement",
          prevEl: ".prev-achievement",
        },
        mousewheel: true,
        grabCursor: true,
      });
    }
  }

  window.addEventListener("load", initSwiper);
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initSwiper, 200);
  });
});
