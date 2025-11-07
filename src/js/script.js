document.addEventListener("DOMContentLoaded", () => {
  // ====== MOBILE MENU TOGGLE ======
  const openMenuBtn = document.querySelector(".open-menu");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (openMenuBtn && mobileMenu) {
    openMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
    });
  }

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

  // ====== RESUME DOWNLOAD FEEDBACK ======
  document.querySelectorAll(".resume-btn, .d-resume").forEach((el) => {
    el.addEventListener("click", function () {
      const fileName = this.getAttribute("download") || "Resume";
      setTimeout(() => {
        notyf.success(`${fileName} downloaded successfully!`);
      }, 500);
    });
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
});

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
