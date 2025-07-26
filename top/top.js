export function initMenu() {
  const menuButton = document.getElementById("menu-toggle");
  const menu = document.getElementById("menu");

  menuButton.addEventListener("click", () => {
      menu.classList.toggle("active");
      menuButton.classList.toggle("open");
      menu.style.display = "block";
  });

  document.addEventListener("click", (event) => {
      const menuBranco = document.querySelector(".menu-branco");

      if (!menuButton.contains(event.target) && !menuBranco.contains(event.target)) {
          menu.classList.remove("active");
          menuButton.classList.remove("open");

          setTimeout(() => {
              if (!menu.classList.contains("active")) {
                  menu.style.display = "none";
              }
          }, 300);
      }
  });
}

document.getElementsByClassName('logo')[0].addEventListener('click', () => {
    window.location.href = '../index.html'; 
});