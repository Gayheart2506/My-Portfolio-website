"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const preloader = document.getElementById("preloader");
  const navbar = document.querySelector(".custom-navbar");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const year = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbarCollapse = document.getElementById("navbarMenu");

  year.textContent = new Date().getFullYear();

  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.classList.add("hide");
    }, 700);
  });

  const handleScrollEffects = () => {
    if (window.scrollY > 70) {
      navbar.classList.add("scrolled");
      scrollTopBtn.classList.add("show");
    } else {
      navbar.classList.remove("scrolled");
      scrollTopBtn.classList.remove("show");
    }

    updateActiveNavLink();
  };

  const updateActiveNavLink = () => {
    const sections = document.querySelectorAll("section[id], header[id]");
    let currentSection = "home";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", handleScrollEffects);
  handleScrollEffects();

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbarCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.hide();
      }
    });
  });

  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !subject || !message) {
      showFormStatus("Please complete all fields before sending.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showFormStatus("Please enter a valid email address.", "error");
      return;
    }

    const mailtoLink = createMailtoLink({
      name,
      email,
      subject,
      message
    });

    showFormStatus("Opening your email app...", "success");

    setTimeout(() => {
      window.location.href = mailtoLink;
      contactForm.reset();
      showFormStatus("Message prepared successfully ✔️", "success");
    }, 600);
  });

  const showFormStatus = (message, type) => {
    formStatus.textContent = message;

    if (type === "error") {
      formStatus.style.color = "#fb7185";
    } else {
      formStatus.style.color = "#5eead4";
    }
  };

  const isValidEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const createMailtoLink = ({ name, email, subject, message }) => {
    const ownerEmail = "ayoogayheart@gmail.com";

    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(
      `Hello Gayheart,\n\n${message}\n\nSender Name: ${name}\nSender Email: ${email}`
    );

    return `mailto:${ownerEmail}?subject=${emailSubject}&body=${emailBody}`;
  };
});
