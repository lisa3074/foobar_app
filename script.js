"use strict";
import "@babel/polyfill";
import { getUser } from "./modules/login";
import { displayDisabledButton } from "./modules/login";
import { cartDelegation } from "./modules/order";
import { toggleMenu } from "./modules/navigation";
import { indexDelegation } from "./modules/queue";
import { loadJsonBeer } from "./modules/beer";
import { checkIfValid } from "./modules/order";
import { getData } from "./modules/win";
import { card } from "./modules/card_ani";
import { loadJson as bigQueue } from "./modules/bigQueue";
import { getData as bigWin } from "./modules/bigWin";
import { loadJson as bigLine } from "./modules/bigLine";

window.addEventListener("DOMContentLoaded", appDelegation);

function appDelegation() {
  console.log("appDelegation");
  const loginBody = document.querySelector(".loginBody");
  const orderBody = document.querySelector(".orderBody");
  const beerBody = document.querySelector(".beerBody");
  const indexBody = document.querySelector(".indexBody");
  const winBody = document.querySelector(".winBody");
  const dashBody = document.querySelector(".dashBody");

  if (loginBody) {
    document.querySelector(".grid_item3 .log_into_account").addEventListener("click", getUser);
    document.querySelector(".grid_item3 .log_into_account").addEventListener("click", displayDisabledButton);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        getUser();
        displayDisabledButton();
      }
    });
    document.querySelector(".menu-login").classList.add("chosen");
    document.querySelector(".menu-login .icon_wrapper").classList.add("chosen_img");
    toggleMenu();
  }
  if (orderBody) {
    const form = document.querySelector("form");
    const elements = form.elements;

    //DEBUG, FJERN EFTER
    window.elements = elements;
    window.form = form;

    document.querySelector(".menu-buy").classList.add("chosen");
    document.querySelector(".menu-buy .icon_wrapper").classList.add("chosen_img");
    cartDelegation();
    toggleMenu();
    card();
    form.setAttribute("novalidate", true);
  }
  if (beerBody) {
    document.querySelector(".menu-beer").classList.add("chosen");
    document.querySelector(".menu-beer .icon_wrapper").classList.add("chosen_img");
    toggleMenu();
    loadJsonBeer();
  }
  if (indexBody) {
    document.querySelector(".menu-home").classList.add("chosen");
    document.querySelector(".menu-home .icon_wrapper").classList.add("chosen_img");
    document.querySelector(".big_icon.win").addEventListener("click", function () {
      location.href = "win.html";
    });
    indexDelegation();
    toggleMenu();
  }
  if (winBody) {
    document.querySelector(".menu-win").classList.add("chosen");
    document.querySelector(".menu-win .icon_wrapper").classList.add("chosen_img");
    getData();
    toggleMenu();
  }
  if (dashBody) {
    dashDelegation();
  }
}

function dashDelegation() {
  console.log("dashDelegation");
  bigQueue();
  bigWin();
  bigLine();
}
