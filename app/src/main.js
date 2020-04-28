"use strict";

const $ = require('jquery');

function getPageList() {
  $("h1").remove();
  $.get("./api/api.php", (data) => {
    data.forEach((file) => {
      $('body').append("<h1>" + file + "</h1>");
    });
    
  }, "JSON"); 
 }

getPageList();

$("button").click(() => {

  $.post("./api/createNewHtmlPage.php", {
    "name": $("input").val()
  }, (data) => {
    getPageList();
  })
  .fail(() => {
    alert('Страница есть! Удалить ее?');  

  });
});
