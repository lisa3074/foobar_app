let locationSite;
const url = "https://foobar3rdsemester.herokuapp.com/beertypes";
let jsonData;
let filter;
let amount = 0;
/*//////////////////////////////////
////// DELEGATION FUNCTIONS ///////
//////////////////////////////////*/

export function cartDelegation() {
  console.log("cartDelegation");

  checkAvailability();
  setAmount();
  loadJson();
  closePopUp();

  document.querySelector(".close_more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.add("hidden_left");
    document.querySelector(".more_container").classList.remove("show");
  });

  //document.querySelector(".button_container .more").addEventListener("click", displayReadMore);
  document.querySelector(".order_nav_wrapper .reset").addEventListener("click", reset);
  document.querySelector(".view_cart").addEventListener("click", checkAmountInCart);
  document.querySelector(".checkout").addEventListener("click", displayPayment);
  document.querySelector(".credit_card_nav .pay").addEventListener("click", checkValidity);
  document.querySelector(".thank_you_nav .home").addEventListener("click", checkValidity);
  document.querySelector(".thank_you_nav .log_in_done").addEventListener("click", function () {
    locationSite = "/login.html";
    goToPage(locationSite);
  });
  document.querySelector(".thank_you_nav .home").addEventListener("click", function () {
    locationSite = "/index.html";
    goToPage(locationSite);
  });
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

function goToPage(locationSite) {
  console.log("goToPage");
  document.querySelector(".orderBody").classList.add("fadeOutQuick");
  setTimeout(() => {
    location.href = locationSite;
  }, 500);
}

function closePopUp() {
  console.log("closePopUp");
  document.querySelectorAll(".cart_close, .edit").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelector(".cart").classList.add("fadeOut");
      document.querySelector(".cart").classList.remove("fadeInRight");
      setTimeout(() => {
        document.querySelector(".cart").classList.add("hide");
        document.querySelector(".result_nav").classList.remove("hide");
        document.querySelector(".card").classList.add("hide");
        document.querySelector(".credit_card_nav").classList.add("hide");
        document.querySelector(".thank_you").classList.add("hide");
        document.querySelector(".thank_you_nav").classList.add("hide");
        document.querySelector(".thank_you_nav").classList.add("hide");
      }, 1200);
    });
  });
}

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

async function loadJson() {
  console.log("loadJson - order.js");
  let response = await fetch(url);
  jsonData = await response.json();
  //setReadMore();
  fetchProducts();
}

function fetchProducts() {
  console.log("fetchProducts");
  document.querySelector(".order_container").innerHTML = "";
  jsonData.forEach(displayProducts);
}

function setReadMore() {
  console.log("setReadMore");
  document.querySelector(".more_container").innerHTML = "";
  jsonData.forEach(displayReadMore);
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
  displayThankYou();
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
  jsonData.forEach((entry) => {
    if (entry.name == filter) {
      document.querySelector(".more_container .name").textContent = entry.name;
      document.querySelector(".more_container .cat").textContent = entry.category;
      document.querySelector(".more_container .alc").textContent = entry.alc + "%";
      document.querySelector(".more_container .aroma").textContent = entry.description.aroma;
      document.querySelector(".more_container .appearance").textContent = entry.description.appearance;
      document.querySelector(".more_container .mouth_feel").textContent = entry.description.mouthfeel;
      document.querySelector(".more_container .flavor").textContent = entry.description.flavor;
      document.querySelector(".more_container .overall").textContent = entry.description.overallImpression;
      document.querySelector(".more_container .label").src = "images/labels/" + entry.label;
    }
  });
}

function reset() {
  console.log("reset");
}

function displayProducts(entry) {
  console.log("displayProducts");

  const clone = document.querySelector(".products_sold").content.cloneNode(true);
  clone.querySelector(".name").textContent = entry.name;
  clone.querySelector(".beer_category").textContent = entry.category;
  clone.querySelector(".price").textContent = "40DKK";
  clone.querySelector(".product_details .label").src = "images/labels/" + entry.label;
  clone.querySelector(".product_details .label").alt = entry.name;
  // clone.querySelector(".beer_category").textContent = entry.category;
  clone.querySelector("summary").addEventListener("click", function () {
    document.querySelector(".product_details .aroma").textContent = entry.description.aroma;
    document.querySelector(".product_details .alc").textContent = entry.alc + "%";
  });

  clone.querySelector(".add").addEventListener("click", function () {
    document.querySelector(".times").classList.remove("hide");
    amount++;
    document.querySelector(".amount_chosen").textContent = amount;
    console.log(amount);
  });
  clone.querySelector(".remove").addEventListener("click", function () {
    if (amount == 0) {
      amount = 0;
    } else {
      document.querySelector(".times").classList.remove("hide");
      amount--;
      document.querySelector(".amount_chosen").textContent = amount;
      console.log(amount);
    }
  });

  clone.querySelector(".more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.remove("hidden_left");
    document.querySelector(".more_container").classList.add("show");
    filter = entry.name;
    displayReadMore();
  });

  /*   clone.querySelector("details").addEventListener("click", function () {
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
  }); */

  document.querySelector(".order_container").appendChild(clone);
}
function displayError() {
  console.log("displayError - order.js");
}

function displaySummary() {
  console.log("displaySummary");
  document.querySelector(".result").classList.remove("hide");
  document.querySelector(".cart").classList.remove("hide");
  document.querySelector(".cart").classList.remove("fadeOut");
  document.querySelector(".cart").classList.add("fadeInRight");
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
