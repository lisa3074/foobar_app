let locationSite;
const url = "https://foobar3rdsemester.herokuapp.com/beertypes";
let jsonData;
let filter;
let amount = 0;
let productArray = [];
let amountArray = [];
let amountObject;
let object;
/* const form = document.querySelector("form");
const elements = form.elements; */
let total_amount = 0;
let total_price = 0;
//DEBUG, FJERN EFTER
/* window.elements = elements;
window.form = form; */

//let amountArray = [];

const Product = {
  name: "",
  amount: "", //antal øl
  total: "",
  beer_amount: "", //antal øl i alt
  category: "",
  price: "",
  aroma: "",
  alcohol: "",
  label: "",
  appearance: "",
  flavor: "",
  overall: "",
  mouthfeel: "",
  username: "",
  password: "",
  order_number: "",
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
  logInOrSignUp();

  document.querySelector(".close_more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.add("hidden_left");
    document.querySelector(".more_container").classList.remove("show");
  });

  //document.querySelector(".button_container .more").addEventListener("click", displayReadMore);
  document.querySelector(".order_nav_wrapper .reset").addEventListener("click", reset);
  document.querySelector(".view_cart").addEventListener("click", displaySummary);
  document.querySelector(".checkout").addEventListener("click", displayPayment);
  document.querySelector(".credit_card_nav .pay").addEventListener("click", (e) => {
    checkIfValid(e);
    console.log("VALID?");
  });

  //document.querySelector(".thank_you_nav .home").addEventListener("click", checkValidity);
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
      window.scrollTo(0, 0);
      document.querySelector(".cart").classList.add("fadeOut");
      document.querySelector(".cart").classList.remove("fadeInRight");
      total_price = 0;
      total_amount = 0;
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
  document.querySelectorAll(".cart_close").forEach((cross) => {
    cross.addEventListener("click", function () {
      form.reset();
      document.querySelectorAll(".amount_chosen").forEach((amount) => {
        amount.textContent = "";
      });
      document.querySelectorAll(".times").forEach((times) => {
        times.classList.add("hide");
      });
      reset();
    });
  });
}

function logInOrSignUp() {
  console.log("form");

  document.querySelectorAll(".radio").forEach((radio) => {
    radio.addEventListener("change", function () {
      const login = document.querySelector("#has_account").checked;
      if (login) {
        console.log("log in");
        document.querySelector(".invalid_password2").classList.add("hide");
        document.querySelector("#secure_pass").removeAttribute("required");
        document.querySelector(".secure_pass").classList.add("hide");
      } else {
        console.log("create account");
        document.querySelector("#secure_pass").setAttribute("required", "");
        document.querySelector(".secure_pass").classList.remove("hide");
      }
    });
  });
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
  let arrayProduct = productArray;
  makeBeerObject(arrayProduct);
}

function makeAmountObject() {
  console.log("makeAmountObject");
  jsonData.forEach((beer) => {
    const amountObject = Object.create(Product);
    amountObject.name = beer.name;
    amountObject.amount = amount;
    amountArray.push(amountObject);
  });
  return amountArray;
}

function makeBeerObject(array) {
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
    array.push(productObject);
  });
  object = makeAmountObject();
  fetchProducts(productArray);
}

function fetchProducts(product) {
  console.log("fetchProducts");
  document.querySelector(".order_container").innerHTML = "";
  product.forEach(displayProducts);
}

function checkIfValid(e) {
  console.log("checkIfValid");
  e.preventDefault();
  const isValid = form.checkValidity();
  const forElements = form.querySelectorAll("input");
  const creditNum = document.querySelector("#number");
  const month = document.querySelector("#month");
  const year = document.querySelector("#year");
  const cvc = document.querySelector("#secure");
  const name = document.querySelector("#full_name");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  const password2 = document.querySelector("#secure_pass");
  const login = document.querySelector("#has_account").checked;

  forElements.forEach((el) => {
    el.classList.remove("invalid");
    el.addEventListener("focus", function () {
      this.classList.remove("invalid");
    });
    el.addEventListener("focusout", function () {
      if (!el.checkValidity()) {
        console.log("invalid");
        //If not valid add class invalid
        el.classList.add("invalid");
      }
    });
  });

  const formIsValid = passWord();
  const user = getRestDB();

  if (isValid && formIsValid) {
    /*  post({
      name: object.name,
      amount: object.amount,
    }); */
    console.log("all good");
    form.reset();
    payDelegation();
    displayThankYou();
  } else {
    //check if any inputs are invalid
    forElements.forEach((el) => {
      if (!el.checkValidity()) {
        console.log("invalid");
        console.log(el);
        //If not valid add class invalid
        el.classList.add("invalid");
      }
    });
    if (creditNum.classList[1] == "invalid" || creditNum.classList[2] == "invalid" || creditNum.classList[0] == "invalid") {
      document.querySelector(".invalid_creditcard").classList.remove("hide");
    } else {
      document.querySelector(".invalid_creditcard").classList.add("hide");
    }
    if (month.classList[0] == "invalid" || month.classList[1] == "invalid") {
      document.querySelector(".invalid_month").classList.remove("hide");
    } else {
      document.querySelector(".invalid_month").classList.add("hide");
    }
    if (year.classList[0] == "invalid" || year.classList[1] == "invalid") {
      document.querySelector(".invalid_year").classList.remove("hide");
    } else {
      document.querySelector(".invalid_year").classList.add("hide");
    }
    if (cvc.classList[0] == "invalid" || cvc.classList[1] == "invalid") {
      document.querySelector(".invalid_cvc").classList.remove("hide");
    } else {
      document.querySelector(".invalid_cvc").classList.add("hide");
    }
    if (name.classList[0] == "invalid" || name.classList[1] == "invalid") {
      document.querySelector(".invalid_name").classList.remove("hide");
    } else {
      document.querySelector(".invalid_name").classList.add("hide");
    }
    if (username.classList[0] == "invalid") {
      document.querySelector(".invalid_user").classList.remove("hide");
    } else {
      document.querySelector(".invalid_user").classList.add("hide");
    }
    if (password.classList[0] == "invalid") {
      document.querySelector(".invalid_password").classList.remove("hide");
    } else {
      document.querySelector(".invalid_password").classList.add("hide");
    }
  }
  console.log("submitted");
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

function passWord() {
  console.log("password");
  let formIsValid;
  const password1 = document.querySelector("#password").value;
  const password2 = document.querySelector("#secure_pass").value;
  const login = document.querySelector("#has_account").checked;

  if (login) {
    console.log("check valid");
    formIsValid = true;
    document.querySelector(".secure_pass .invalid_text").classList.add("hide");
    document.querySelector(".invalid_password2").classList.add("hide");
    // document.querySelector("#secure_pass").removeAttribute("required");
    document.querySelector(".secure_pass").classList.remove("invalid");
  } else {
    // document.querySelector("#secure_pass").setAttribute("required", "");
    if (password2 === password1) {
      //if valid
      formIsValid = true;
      console.log("A match");
      document.querySelector(".invalid_password2").classList.add("hide");
      document.querySelector(".secure_pass .invalid_text").classList.add("hide");
      document.querySelector(".secure_pass").classList.remove("invalid");
    } else {
      console.log("does not match");
      console.log(password1 + " " + password2);
      //If invalid
      document.querySelector(".invalid_password2").classList.remove("hide");
      document.querySelector(".secure_pass .invalid_text").classList.remove("hide");
      document.querySelector(".secure_pass").classList.add("invalid");
      formIsValid = false;
    }
  }
  return formIsValid;
}

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
  amountArray.forEach((beer) => {
    beer.amount = 0;
    total_amount = 0;
    total_price = 0;
    amount = 0;
    document.querySelectorAll(".amount_chosen").forEach((amount) => {
      amount.textContent = "";
    });
    document.querySelectorAll(".times").forEach((time) => {
      time.classList.add("hide");
    });
  });
  console.log(amountArray);
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
    console.log(filter);
    amount++;
    theAmount(this, 1);
  });

  clone.querySelector(".remove").addEventListener("click", function () {
    filter = beer.name;
    amount--;
    theAmount(this, -1);
  });

  clone.querySelector(".more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.remove("hidden_left");
    document.querySelector(".more_container").classList.add("show");
    filter = beer.name;
    displayReadMore();
  });
  document.querySelector(".order_container").appendChild(clone);
}

function theAmount(e, modifier) {
  console.log("theAmount");
  console.log(e.parentNode.previousElementSibling.querySelector(".amount_chosen"));
  object.forEach((el) => {
    if (filter == el.name) {
      console.log("The same");
      console.log(el.name);
      if ((e.classList[0] === "remove" && amount == 0) || amount < 0) {
        amount = 0;
        el.amount = amount; //reset amount ved anden entry i array
        e.parentNode.previousElementSibling.querySelector(".amount_chosen").textContent = "";
        e.parentNode.previousElementSibling.querySelector(".times").classList.add("hide");
        console.log(el.amount);
        console.table(amountArray);
      } else {
        el.amount = el.amount + modifier; //reset amount ved anden entry i array
        e.parentNode.previousElementSibling.querySelector(".amount_chosen").textContent = el.amount;

        e.parentNode.previousElementSibling.querySelector(".times").classList.remove("hide");
        console.log(el.amount);
        console.table(amountArray);
      }
    } else {
      console.log("not the same");
    }
  });
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
  document.querySelector(".result_list").innerHTML = "";

  //forEach -> createElement
  amountArray.forEach((ordered) => {
    if (ordered.amount > 0) {
      total_price += ordered.amount * 40;
      total_amount += ordered.amount;
      const clone = document.querySelector(".cart_sumup").content.cloneNode(true);
      clone.querySelector(".article").textContent = ordered.name;
      clone.querySelector(".amount").textContent = ordered.amount + " pcs.";
      clone.querySelector(".final_amount").textContent = total_price + " DKK";
      document.querySelector(".result_list").appendChild(clone);
    }
  });
  if (total_amount == 0) {
    document.querySelector(".checkout").setAttribute("disabled", "");
    document.querySelector(".zero_beer").textContent = "You need to put some beer in the cart to buy some!";
  } else {
    document.querySelector(".checkout").removeAttribute("disabled");
    document.querySelector(".zero_beer").textContent = "";
  }
  document.querySelector(".total_amount").textContent = total_price;
  document.querySelector(".total_amount_right").textContent = total_price;
  document.querySelector(".total_amount_bottom").textContent = total_price;
  document.querySelector(".wrap .your_number").textContent = total_amount;
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
