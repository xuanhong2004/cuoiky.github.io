import Swiper from 'swiper/swiper-bundle.mjs';
import 'swiper/swiper-bundle.css';

var swiper = new Swiper('.swiper', {
  slidesPerView: 3,
  spaceBetween: 30,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});