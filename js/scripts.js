'use strict';

$(function(){

  $("#mobile-menu").hide();
  $('#menu-fixed').hide();

});

$(document).scroll(function () {
  var y = $(this).scrollTop();

  if (window.innerWidth > 600) {
    if (y < 450) {
      $("#menu_buttons_fixed").fadeOut();
    } else {
      $("#menu_buttons_fixed").fadeIn();
    }
    // Sandwiches 400
    if (y < 350) {
      $('#menu-fixed').fadeOut();
    }
    if (y > 350 && y < 1405) {
      $('#menu-fixed').fadeIn();
      $("#sides-menu-update")
        .html(
          "<strong>Sides:</strong> ..."
        );
      $("#toppings-menu-update")
        .html(
          "<strong>Toppings:</strong> lettuce, tomato, red onions, tabouli salad, white turnip, red cabbage, beets, green peppers, jalepeno peppers, and cucumbers"
        );
      $("#sauces-menu-update")
        .html(
          "<strong>Sauces:</strong> tahina, garlic sauce, hummus, hot sauce, and sweet donair sauce"
        );
    }
    // Plates 1405
    if (y > 1400 && y < 2110) {
      $('#menu-fixed').fadeIn();
      $("#sides-menu-update")
        .html(
          "<strong>Sides:</strong> rice with mixed vegetables (corn, carrot, and peas), chickpea salad and curried potatoes"
        );
      $("#toppings-menu-update")
        .html(
          "<strong>Toppings:</strong> lettuce, tomato, red onions, tabouli salad, white turnip, red cabbage, beets, green peppers, jalepeno peppers, and cucumbers"
        );
      $("#sauces-menu-update")
        .html(
          "<strong>Sauces:</strong> tahina, garlic sauce, hummus, hot sauce, and sweet donair sauce"
        );
    }

    if (y > 2110) {
       $('#menu-fixed').fadeOut();
    }

  } else {
    $('#menu-fixed').hide();
    $('#menu_buttons_fixed').hide();
  }

});


function toggleMobileNav() {

    var mobile_nav = $("#mobile-menu").hasClass("display");
    console.log(mobile_nav);

    if (mobile_nav) {
      $("#mobile-menu").slideUp();
      $("#mobile-menu").removeClass("display");
    } else {
      $("#mobile-menu").slideDown();
      $("#mobile-menu").addClass("display");
    }

}

function closeModal() {
  $("#modal").fadeOut();
  $("#modal .modal-img").fadeOut();
}

function openImgModal(id) {
  $("#modal").fadeIn();
  $("#modal-img-"+id).fadeIn();
}