"use strict";
import "@babel/polyfill";
import { checkValidity } from "./modules/login";
import { cartDelegation } from "./modules/order";
import { toggleMenu } from "./modules/navigation";
import { indexDelegation } from "./modules/queue";
import { getData } from "./modules/win";
import { loadJson as bigQueue } from "./modules/bigQueue";
import { getData as bigWin } from "./modules/bigWin";
import { loadJson as bigLine } from "./modules/bigLine";

window.addEventListener("DOMContentLoaded", appDelegation);

function appDelegation() {
  console.log("appDelegation");
  const loginBody = document.querySelector(".loginBody");
  const orderBody = document.querySelector(".orderBody");
  const indexBody = document.querySelector(".indexBody");
  const winBody = document.querySelector(".winBody");
  const dashBody = document.querySelector(".dashBody");

  if (loginBody) {
    document.querySelector(".grid_item3 .log_into_account").addEventListener("click", checkValidity);
    toggleMenu();
  }
  if (orderBody) {
    cartDelegation();
    toggleMenu();
  }
  if (indexBody) {
    indexDelegation();
    toggleMenu();
  }
  if (winBody) {
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
