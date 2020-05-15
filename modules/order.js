/*//////////////////////////////////
////// DELEGATION FUNCTIONS ///////
//////////////////////////////////*/

export function cartDelegation() {
  console.log("cartDelegation");
  checkAvailability();
  setAmount();
  loadJson();

  document.querySelector(".button_container .more").addEventListener("click", displayReadMore);
  document.querySelector(".order_nav_wrapper .reset").addEventListener("click", reset);
  document.querySelector(".order_nav_wrapper .view_cart").addEventListener("click", setSummary);
  document.querySelector(".credit_card_nav .pay").addEventListener("click", checkValidity);
}

function payDelegation() {
  console.log("payDelegation");
  updateCounter();
  const order = createHerokuObject();
  const orderDetails = postHeroku(order);
  const restDbObject = createRestDbObject(orderDetails);
  postRestDb(restDbObject);
}

/*
////////////////////////////////////
////// CALCULATION FUNCTIONS ///////
//////////////////////////////////*/

function checkAvailability() {
  console.log("checkAvailability");
  //if some tabs are empty
  displayDisabled();
}

function setAmount() {
  console.log("setAmount");
  displayAmount();
}

function loadJson() {
  console.log("loadJson - order.js");
  setReadMore();
}

function setReadMore() {
  console.log("setReadMore");
}

function setSummary() {
  console.log("setSummary");
  //forEach -> createElement
  displaySummary();
}

function checkValidity() {
  console.log("checkValidity - order.js");
  const user = getRestDB();
  //Check if valid
  //If invalid user/password
  displayError();
  //if valid
  payDelegation();
}

function updateCounter() {
  console.log("updateCounter");
  //PUT beer ordered
}

function postRestDb(restDbObject) {
  console.log("postRestDb");
  //POST object to restDB
}

/*
////////////////////////////////////
////// RETURN FUNCTIONS ///////
//////////////////////////////////*/

function getRestDB() {
  console.log("getRestDB - order.js");
  return;
}

function createHerokuObject() {
  console.log("createHerokuObject");
  //name, amount
  return;
}

function postHeroku(order) {
  console.log("postHeroku");
  //POST object to heroku DB
  const orderDetails = getHeroku();
  displayThankYou(orderDetails);
  return orderDetails;
}

function getHeroku() {
  console.log("createRestDbObject");
  //GET the just placed order (order number and bartender)
  const orderDetails = "whatever the GET returns";
  return orderDetails;
}

function createRestDbObject(orderDetails) {
  console.log("createRestDbObject");
  const restDbObject = "the object created";
  //name, amount, total, beer_amount, full_price, username, password, order_number, bartender
  return restDbObject;
}

/*
////////////////////////////////////
////// DISPLAY FUNCTIONS ///////
//////////////////////////////////*/

function displayDisabled() {
  console.log("displayDisabled");
}
function displayAmount() {
  console.log("displayAmount");
}

function displayReadMore() {
  console.log("displayReadMore");
}

function reset() {
  console.log("reset");
}

function displaySummary() {
  console.log("displaySummary");
}
function displayError() {
  console.log("displayError - order.js");
}
function displayThankYou(orderDetails) {
  console.log("displayThankYou");
}
