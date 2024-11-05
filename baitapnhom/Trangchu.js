// Tải header và footer
fetch("/ThanhToan/header_footer.html")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.text();
  })
  .then((data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, "text/html");
    document.getElementById("header-placeholder").innerHTML =
      doc.querySelector("header").outerHTML;
    document.getElementById("footer-placeholder").innerHTML =
      doc.querySelector("footer").outerHTML;
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

let list = document.querySelector(".slider .list");
let items = document.querySelectorAll(".slider .list .item");
let dots = document.querySelectorAll(".slider .dots li");
let prev = document.getElementById("prev");
let next = document.getElementById("next");

let active = 0;
let lengthItems = items.length - 1;

next.onclick = function () {
  if (active + 1 > lengthItems) {
    active = 0;
  } else {
    active = active + 1;
  }
  reloadSlider();
};

prev.onclick = function () {
  if (active - 1 < 0) {
    active = lengthItems;
  } else {
    active = active - 1;
  }
  reloadSlider();
};

let refreshSlider = setInterval(() => {
  next.click();
}, 3000);

function reloadSlider() {
  let checkLeft = items[active].offsetLeft;
  list.style.left = -checkLeft + "px";

  let lastActiveDot = document.querySelector(".dots li.active");
  lastActiveDot.classList.remove("active");

  dots[active].classList.add("active");

  clearInterval(refreshSlider);
  refreshSlider = setInterval(() => {
    next.click();
  }, 3000);
}

dots.forEach((li, key) => {
  li.addEventListener("click", function () {
    active = key;
    reloadSlider();
  });
});
