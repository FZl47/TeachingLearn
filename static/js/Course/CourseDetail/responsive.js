
//Responsive Layot
window.addEventListener('resize', function(){
  window.location.reload();
});
const mediaQuery = window.matchMedia("(max-width:1200px)");

if (mediaQuery.matches) {
  const aside = document.querySelector("aside");
  aside.classList.remove("position-absolute");
  aside.classList.remove("end-0");
  aside.classList.add("w-100");
  aside.classList.add("mx-auto");
  const asideChildern = document.querySelectorAll("aside div");
  asideChildern.forEach((element) => {
    element.classList.add("w-100");
  });
  const main = document.querySelector("main");
  const mainComment = document.querySelectorAll(
    "main #commentsExample div img"
  );
  mainComment.forEach((element) => {
    element.remove();
  });
  main.classList.remove("position-absolute");
  main.classList.add("w-100");
  main.classList.add("mx-auto");
}
