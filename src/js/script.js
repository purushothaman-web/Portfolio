document.addEventListener("DOMContentLoaded", () => {
  const openMenuBtn = document.querySelector(".open-menu");
  const mobileMenu = document.querySelector(".mobile-menu");

  openMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("active");
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.classList.remove("theme-blue", "theme-dark", "theme-purple");
    html.classList.add(savedTheme);
  } else {
    html.classList.add("theme-blue"); // default
  }

  // Get all theme toggle buttons and menus
  const toggleButtons = document.querySelectorAll('[id^="radix-"]');
  const themeMenus = document.querySelectorAll(".theme-menu");

  toggleButtons.forEach((btn, index) => {
    const menu = themeMenus[index];

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");

      // Hide other menus
      themeMenus.forEach((m, i) => {
        if (i !== index) m.classList.add("hidden");
      });
    });
  });

  // Theme option click
  document.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", () => {
      const selectedTheme = option.getAttribute("data-theme");
      html.classList.remove("theme-blue", "theme-dark", "theme-purple");
      html.classList.add(selectedTheme);
      localStorage.setItem("theme", selectedTheme);

      // Hide all theme menus
      themeMenus.forEach((menu) => menu.classList.add("hidden"));
    });
  });

  // Hide dropdown if clicked outside
  document.addEventListener("click", (e) => {
    themeMenus.forEach((menu) => menu.classList.add("hidden"));
  });
});

// Initialize Notyf
const notyf = new Notyf({
  duration: 2000,
  position: { x: "right", y: "bottom" },
  ripple: true,
  dismissible: true,
});

document.querySelectorAll(".resume-btn, .d-resume").forEach((el) => {
  el.addEventListener("click", function () {
    const fileName = this.getAttribute("download") || "Resume";
    setTimeout(() => {
      notyf.success(`${fileName} downloaded successfully!`);
    }, 500);
  });
});

const form = document.querySelector(".contact-card");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");

  let isValid = true;

  // Clear existing popups
  document.querySelectorAll(".error-popup").forEach((popup) => popup.remove());

  function showError(input, message) {
    const popup = document.createElement("div");
    popup.classList.add("error-popup");
    popup.textContent = message;
    input.parentElement.appendChild(popup);
    popup.style.display = "block";
    setTimeout(() => popup.remove(), 2000);
  }

  // Validation checks
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

  // If valid, proceed with async submission
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

let swiper;

function initSwiper() {
  const isMobile = window.innerWidth <= 768;

  // Destroy Swiper if on mobile
  if (isMobile && swiper) {
    swiper.destroy(true, true);
    swiper = null;
    return;
  }

  // Initialize Swiper on desktop only
  if (!isMobile) {
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

// Initialize on load
window.addEventListener("load", initSwiper);
// Re-initialize on resize
window.addEventListener("resize", initSwiper);
