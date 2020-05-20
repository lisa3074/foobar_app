let locationSite;
const url = "https://foobar3rdsemester.herokuapp.com/beertypes";
let jsonData;
let filter;
let amount = 0;
let productArray = [];

//let amountArray = [];

const Product = {
  name: "",
  category: "",
  price: "",
  aroma: "",
  alcohol: "",
  label: "",
  appearance: "",
  flavor: "",
  overall: "",
  mouthfeel: "",
  amount: "",
};
/*//////////////////////////////////
////// DELEGATION FUNCTIONS ///////
//////////////////////////////////*/

export function cartDelegation() {
  console.log("cartDelegation");

  checkAvailability();
  setAmount();
  loadJson();
  closePopUp();
  form();

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

function form() {
  console.log("form");

  document.querySelectorAll(".radio").forEach((radio) => {
    radio.addEventListener("change", function () {
      const login = document.querySelector("#has_account").checked;
      if (login) {
        console.log("log in");
        document.querySelector(".secure_pass").classList.add("hide");
      } else {
        console.log("create account");
        document.querySelector(".secure_pass").classList.remove("hide");
      }
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

  makeObject();
}

function makeObject() {
  console.log("makeObject");
  jsonData.forEach((product) => {
    const productObject = Object.create(Product);
    productObject.name = product.name;
    productObject.category = product.category;
    productObject.price = "40 DKK";
    productObject.aroma = product.description.aroma;
    productObject.alcohol = product.alc;
    productObject.label = product.label;
    productObject.appearance = product.description.appearance;
    productObject.flavor = product.description.flavor;
    productObject.overall = product.description.overallImpression;
    productObject.mouthfeel = product.description.mouthfeel;
    productObject.amount = "";
    productArray.push(productObject);
  });

  fetchProducts(productArray);
}

function fetchProducts(product) {
  console.log("fetchProducts");
  document.querySelector(".order_container").innerHTML = "";
  product.forEach(displayProducts);
}

function setSummary() {
  console.log("setSummary");
  //forEach -> createElement
  displaySummary();
}

function checkValidity() {
  console.log("checkValidity - order.js");
  const user = getRestDB();

  const password = document.querySelector("#password").value;
  const password2 = document.querySelector("#secure_pass").value;

  if (password2 != password) {
    console.log("does not match");
    //If invalid
    displayError();
  } else {
    //if valid
    console.log("A match");
    payDelegation();
    displayThankYou();
  }
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
  productArray.forEach((beer) => {
    if (beer.name == filter) {
      document.querySelector(".more_container .name").textContent = beer.name;
      document.querySelector(".more_container .cat").textContent = beer.category;
      document.querySelector(".more_container .alc").textContent = beer.alcohol + "%";
      document.querySelector(".more_container .aroma").textContent = beer.aroma;
      document.querySelector(".more_container .appearance").textContent = beer.appearance;
      document.querySelector(".more_container .mouth_feel").textContent = beer.mouthfeel;
      document.querySelector(".more_container .flavor").textContent = beer.flavor;
      document.querySelector(".more_container .overall").textContent = beer.overall;
      document.querySelector(".more_container .label").src = "images/labels/" + beer.label;
    }
  });
}

function reset() {
  console.log("reset");
}

/* function theAmount(e, beer) {
  console.log("theAmount");
  products.forEach((entry) => {
    if (entry.name == filter) {
      console.log(filter);
      const clone = document.querySelector(".products_sold").content.cloneNode(true);
      if ((e.classList[0] === "remove" && amount == 0) || amount < 0) {
        amount = 0;
        clone.querySelector(".amount_chosen").textContent = amount;
        console.log("remove");
        document.querySelector(".order_container").appendChild(clone);
      } else {
        console.log("theAmount");
        clone.querySelector(".times").classList.remove("hide");
        clone.querySelector(".amount_chosen").textContent = amount;
        console.log(amount);
        document.querySelector(".order_container").appendChild(clone);
      }
    }
  });
} */

function theAmount(e, beer) {
  console.log("theAmount");
  if ((filter = beer.name)) {
    if ((e.classList[0] === "remove" && amount == 0) || amount < 0) {
      amount = 0;
      beer.amount = amount; //reset amount ved anden entry i array
      console.log(beer.amount);
      productArray.push(productObject);
      console.log(productArray);
    } else {
      beer.amount = amount;
      //document.querySelector(".amount_chosen").textContent = beer.amount;
      console.log(beer.amount);
      console.log(productArray);
    }
  } else {
    console.log("not the same");
  }
}

function displayProducts(beer) {
  console.log("displayProducts");
  amount = "0";
  const clone = document.querySelector(".products_sold").content.cloneNode(true);
  clone.querySelector(".name").textContent = beer.name;
  clone.querySelector(".beer_category").textContent = beer.category;
  clone.querySelector(".price").textContent = "40 DKK";
  clone.querySelector(".product_details .label").src = "images/labels/" + beer.label;
  clone.querySelector(".product_details .label").alt = beer.name;
  clone.querySelector(".product_details .aroma").textContent = beer.aroma;
  clone.querySelector(".product_details .alc").textContent = beer.alcohol;
  clone.querySelector(".products .amount_chosen").textContent = "";

  clone.querySelector(".add").addEventListener("click", function () {
    filter = beer.name;
    amount++;
    theAmount(this, beer);
  });

  clone.querySelector(".remove").addEventListener("click", function () {
    filter = beer.name;
    amount--;
    theAmount(this, beer);
  });

  clone.querySelector(".more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.remove("hidden_left");
    document.querySelector(".more_container").classList.add("show");
    filter = beer.name;
    displayReadMore();
  });
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
