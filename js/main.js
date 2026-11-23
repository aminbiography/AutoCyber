
/* =========================================
   AUTOCYBER — MAIN JAVASCRIPT
   Version: Initial Prototype
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  if (window.lucide) window.lucide.createIcons();

  /* -----------------------------------------
     1. RESPONSIVE SIDEBAR NAVIGATION
     ----------------------------------------- */

  const menu = document.querySelector(".mobile-topbar .menu");
  const sidebar = document.querySelector("#site-sidebar");
  const overlay = document.querySelector(".nav-overlay");
  const collapseButton = document.querySelector(".sidebar-collapse");
  const navLinks = document.querySelectorAll("#primary-navigation a");

  function setMobileNav(open) {
    if (!menu || !sidebar || !overlay) return;

    sidebar.classList.toggle("mobile-open", open);
    document.body.classList.toggle("nav-open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menu.innerHTML = `<i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }

  if (menu && sidebar && overlay) {
    menu.addEventListener("click", () => {
      setMobileNav(!sidebar.classList.contains("mobile-open"));
    });

    overlay.addEventListener("click", () => setMobileNav(false));

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.forEach((item) => item.classList.remove("active"));
        link.classList.add("active");
        setMobileNav(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMobileNav(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setMobileNav(false);
    });
  }

  if (collapseButton) {
    collapseButton.addEventListener("click", () => {
      const collapsed = document.body.classList.toggle("sidebar-collapsed");
      collapseButton.setAttribute("aria-expanded", String(!collapsed));
      collapseButton.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
      collapseButton.setAttribute("title", collapsed ? "Expand sidebar" : "Collapse sidebar");
      collapseButton.innerHTML = `<i data-lucide="${collapsed ? "panel-left-open" : "panel-left-close"}" aria-hidden="true"></i>`;
      if (window.lucide) window.lucide.createIcons();
    });
  }


  /* -----------------------------------------
     2. AUTOMATIC FOOTER YEAR
     ----------------------------------------- */

  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }


  /* -----------------------------------------
     3. WEBSITE ANALYZER — FORM ELEMENTS
     ----------------------------------------- */

  const analyzerForm = document.querySelector("#analyzerForm");
  const websiteInput = document.querySelector("#websiteUrl");
  const formNote = document.querySelector("#formNote");

  if (!analyzerForm || !websiteInput || !formNote) {
    return;
  }


  /* -----------------------------------------
     4. WEBSITE URL VALIDATION
     ----------------------------------------- */

  function validateWebsiteUrl(value) {

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error("Please enter a website address.");
    }

    // Add HTTPS when the user does not specify a protocol.
    const normalizedValue = /^https?:\/\//i.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;

    const url = new URL(normalizedValue);

    // Only allow HTTP and HTTPS addresses.
    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Only HTTP and HTTPS website addresses are supported.");
    }

    // Require a hostname containing a valid domain structure.
    if (
      !url.hostname ||
      !url.hostname.includes(".") ||
      url.hostname.startsWith(".") ||
      url.hostname.endsWith(".")
    ) {
      throw new Error("Please enter a valid website domain.");
    }

    // Reject URLs containing embedded usernames or passwords.
    if (url.username || url.password) {
      throw new Error("Website addresses must not contain login credentials.");
    }

    return url;

  }


  /* -----------------------------------------
     5. DISPLAY FORM FEEDBACK
     ----------------------------------------- */

  function showMessage(message, color) {

    formNote.textContent = message;
    formNote.style.color = color;

  }


  /* -----------------------------------------
     6. ANALYZER FORM SUBMISSION
     ----------------------------------------- */

  analyzerForm.addEventListener("submit", (event) => {

    event.preventDefault();

    try {

      const websiteUrl = validateWebsiteUrl(websiteInput.value);

      // Display the normalized URL in the input.
      websiteInput.value = websiteUrl.href;

      // Prototype feedback — actual scanning is not connected yet.
      showMessage(
        `Thanks — ${websiteUrl.hostname} is ready for a future AutoCyber analysis. Website scanning is not connected yet.`,
        "#8ee5df"
      );

    } catch (error) {

      showMessage(
        error.message || "Please enter a valid website address, such as example.com.",
        "#ff9baf"
      );

      websiteInput.focus();

    }

  });

});
