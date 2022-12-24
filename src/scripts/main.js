$(function () { 


  $('.reviews__slider').slick({
    dots: true,
    arrows: true,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 6000,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: $('.prev'),
    nextArrow: $('.next'),
    responsive: [
      {
        breakpoint: 1111,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 765,
        settings: {
          slidesToShow: 1,
          arrows: false,
          slidesToScroll: 1,
        }
      }
    ]
  });




  $("#phone").mask("+7 (999) 999-99-99");
})