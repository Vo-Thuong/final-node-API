document.addEventListener("DOMContentLoaded", function () {
  console.log("MyStore Admin System Ready!");

  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".mystore-navbar");
    if (window.scrollY > 50) {
      navbar.style.background = "#1a1d20";
    } else {
      navbar.style.background = "rgba(33, 37, 41, 0.95)";
    }
  });
});
