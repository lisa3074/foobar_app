/*//////////////////////////////////
////// DELEGATION FUNCTIONS ///////
//////////////////////////////////*/

export function cartDelegation() {
  console.log("cartDelegation");

  checkAvailability();
  setAmount();
  loadJson();

  document.querySelector(".down").addEventListener("click", function () {
    const isOpen = document.querySelector("details").getAttribute("open");
    if (isOpen == null) {
      document.querySelector("details").setAttribute("open", "");
      document.querySelector(".arrow_down").classList.add("go_down");
      document.querySelector(".arrow_down").classList.remove("go_up");
    } else {
      document.querySelector(".arrow_down").classList.remove("go_down");
      document.querySelector(".arrow_down").classList.add("go_up");
      document.querySelector(".first_part_grid").classList.add("opacity");
      document.querySelector(".button_container").classList.add("opacity");
      setTimeout(() => {
        document.querySelector("details").removeAttribute("open", "");
        document.querySelector(".first_part_grid").classList.remove("opacity");
        document.querySelector(".button_container").classList.remove("opacity");
      }, 500);
    }
  });

  document.querySelector(".more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.remove("hidden_left");
    document.querySelector(".more_container").classList.add("show");
  });
  document.querySelector(".close_more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.add("hidden_left");
    document.querySelector(".more_container").classList.remove("show");
  });

  document.querySelector(".button_container .more").addEventListener("click", displayReadMore);
  document.querySelector(".order_nav_wrapper .reset").addEventListener("click", reset);
  document.querySelector(".view_cart").addEventListener("click", checkAmountInCart);
  document.querySelector(".checkout").addEventListener("click", displayPayment);
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
function checkAmountInCart() {
  console.log("checkAmountInCart");
  //CHECK IF ANYTHIN IS IN THE CART, IF YES=>
  setSummary();
}

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
  document.querySelector(".result").classList.remove("hide");
  document.querySelector(".cart").classList.remove("hide");
  document.querySelector(".cart").classList.remove("fadeOut");
  document.querySelector(".cart").classList.add("fadeInRight");

  document.querySelector(".cart_close").addEventListener("click", function () {
    document.querySelector(".cart").classList.add("fadeOut");
    document.querySelector(".cart").classList.remove("fadeInRight");
    setTimeout(() => {
      document.querySelector(".cart").classList.add("hide");
    }, 1200);
  });
}

function displayPayment() {
  console.log("displayPayment");
  document.querySelector(".result").classList.add("fadeOutQuick");
  setTimeout(() => {
    document.querySelector(".result").classList.add("hide");
    document.querySelector(".result_nav").classList.add("hide");
    document.querySelector(".result").classList.remove("fadeOutQuick");
  }, 800);
  setTimeout(() => {
    document.querySelector(".card").classList.remove("hide");
    document.querySelector(".credit_card_nav").classList.remove("hide");
    document.querySelector(".card").classList.add("fadeIn");
    document.querySelector(".credit_card_nav").classList.add("fadeIn");
  }, 800);
  setTimeout(() => {
    document.querySelector(".credit_card_nav").classList.remove("fadeIn");
    document.querySelector(".card").classList.remove("fadeIn");
  }, 1600);
}
function displayError() {
  console.log("displayError - order.js");
}
function displayThankYou(orderDetails) {
  console.log("displayThankYou");
  document.querySelector(".card").classList.add("fadeOutQuick");
  setTimeout(() => {
    document.querySelector(".card").classList.add("hide");
    document.querySelector(".credit_card_nav").classList.add("hide");
    document.querySelector(".card").classList.remove("fadeOutQuick");
  }, 800);

  setTimeout(() => {
    document.querySelector(".thank_you").classList.remove("hide");
    document.querySelector(".thank_you_nav").classList.remove("hide");
    document.querySelector(".thank_you").classList.add("fadeIn");
    document.querySelector(".thank_you_nav").classList.add("fadeIn");
  }, 800);
  setTimeout(() => {
    document.querySelector(".thank_you_nav").classList.remove("fadeIn");
    document.querySelector(".thank_you").classList.remove("fadeIn");
  }, 1600);
  reset();
}
