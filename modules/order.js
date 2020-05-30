let locationSite;
const url = "https://foobar3exam.herokuapp.com/beertypes";
const endpoint = "https://foobar3exam.herokuapp.com/";
const restDb = "https://frontend-22d4.restdb.io/rest/foobar";
const apiKey = "5e9581a6436377171a0c234f";
let filter;
let amount = 0;
let productArray = [];
let amountArray = [];
let herokuArray = [];
let restDbArray = [];
let restDbObject;
let object;
let total_amount = 0;
let total_price = 0;
let data;
let order;
let orderDetails;
let theId;
let formIsValid;
let isValid;
let isUserValid;
let username_value;
let password_value;
let email_value;
const today = new Date();
let todayDate = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

const Product = {
  name: "",
  amount: "", //antal øl
  price: "", //pris for alle ens øl
  total_price: "",
  total_beers: "", //antal øl i alt
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
  bartender: "",
  date: "",
  time: "",
  email: "",
};
/*//////////////////////////////////
////// DELEGATING FUNCTIONS ///////
//////////////////////////////////*/

export function cartDelegation() {
  console.log("cartDelegation");
  loadJson();
  closePopUp();
  logInOrSignUp();
  closeMore();
  invalidListners();

  document.querySelector(".view_cart").addEventListener("click", setSummary);
  document.querySelector(".checkout").addEventListener("click", displayPayment);
  document.querySelector(".credit_card_nav .pay").addEventListener("click", (e) => {
    checkIfValid(e);
  });

  document.querySelector(".thank_you_nav .log_in_done").addEventListener("click", function () {
    locationSite = "login.html";
    goToPage(locationSite);
  });
  document.querySelector(".thank_you_nav .home").addEventListener("click", function () {
    locationSite = "index.html";
    goToPage(locationSite);
  });
}

function payDelegation() {
  console.log("payDelegation");
  console.table(orderDetails);

  postHeroku();
  setTimeout(() => {
    displayOrderNumber();
  }, 1300);
  setTimeout(() => {
    displayOrderNumber();
  }, 2000);
  setTimeout(() => {
    postRestDb({
      order_number: theId,
      time: today.getTime(),
      total_beer: amount,
      total_price: total_price,
      username: username_value,
      password: password_value,
      email: email_value,
      date: todayDate,
      restDbArray,
    });
  }, 4000);
}

function goToPage(locationSite) {
  console.log("goToPage");
  document.querySelector(".orderBody").classList.add("fadeOutQuick");
  setTimeout(() => {
    location.href = locationSite;
  }, 500);
}

function closePopUp() {
  console.log("closePopUp");
  document.querySelectorAll(".cart_close, .edit, .reset").forEach((button) => {
    button.addEventListener("click", function () {
      location.href = "order.html";
    });
  });
}

function closeMore() {
  console.log("closeMore");
  document.querySelector(".close_more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.add("hidden_left");
    setTimeout(() => {
      document.querySelector(".more_container").classList.add("hide");
    }, 1000);

    document.querySelector(".more_container").classList.remove("show");
    document.querySelector(".order_container").classList.remove("hide");
    document.querySelector(".order_container").classList.remove("fadeOut");
    document.querySelector(".order_container").classList.add("fadeIn");
    setTimeout(() => {
      document.querySelector(".order_container").classList.remove("fadeIn");
    }, 500);
  });
}

function invalidListners() {
  console.log("invalidListners");
  document.querySelectorAll(".credit_card input").forEach((el) => {
    el.addEventListener("keyup", function () {
      this.classList.remove("invalid");
    });
  });

  const forElements = form.querySelectorAll("input");
  forElements.forEach((el) => {
    el.addEventListener("focus", function () {
      this.classList.remove("invalid");
      setInvalid();
      el.addEventListener("focusout", function () {
        if (!el.checkValidity()) {
          console.log("invalid");
          //If not valid add class invalid
          el.classList.add("invalid");
          setInvalid();
          // el > p.classList.remove("hide");
          if (el.getAttribute("id") == "#username") {
            console.log("username");
          }
          el.addEventListener("keyup", function () {
            el.classList.remove("invalid");
            setInvalid();
          });
        }
      });
    });
  });
}

/*//////////////////////////////////
////////////// THE CART ////////////
//////////////////////////////////*/
////
/////
/////
////
////
/////
/////
//////// MODEL FUNCTIONS ///////////
////////////////////////////////////
////////////////////////////////////

async function checkAvailability() {
  console.log("checkAvailability");
  let beerArray = [];
  let beerName = {};

  //if some tabs are empty
  let response = await fetch(endpoint, {
    method: "get",
  });
  data = await response.json();
  data.storage.forEach((beer) => {
    beerName = beer.name;
    beerArray.push(beerName);
  });
  beerArray.forEach((e) => {
    for (let i = 0; i < data.taps.length; i++) {
      if (data.taps[i]["beer"] == e) {
        let availableBeer = data.taps[i]["beer"];
        displayAvailableBeer(availableBeer);
      }
    }
  });
}

async function loadJson() {
  console.log("loadJson - order.js");
  let response = await fetch(url);
  const jsonData = await response.json();
  makeBeerObject(productArray, jsonData);
  setTimeout(() => {
    checkAvailability();
  }, 200);
}

function makeBeerObject(productArray, jsonData) {
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
    productArray.push(productObject);
  });
  object = makeAmountObject(jsonData);
  fetchProducts(productArray);
}
function makeAmountObject(jsonData) {
  console.log("makeAmountObject");
  jsonData.forEach((beer) => {
    const amountObject = Object.create(Product);
    amountObject.name = beer.name;
    amountObject.amount = amount;
    amountArray.push(amountObject);
  });
  return amountArray;
}

function fetchProducts(product) {
  console.log("fetchProducts");
  document.querySelector(".order_container").innerHTML = "";
  product.forEach(displayProducts);
}

function setAmount(clicked, modifier) {
  console.log("setAmount");
  object.forEach((el) => {
    if (filter == el.name) {
      if ((clicked.classList[0] === "remove" && amount == 0) || amount < 0) {
        amount = 0;
        el.amount = amount;
        displayAmount(0, clicked, el);
        console.table(amountArray);
      } else {
        el.amount = el.amount + modifier;
        displayAmount(1, clicked, el);
        console.table(amountArray);
      }
    }
  });
}

/*//////////////////////////////////
////////////// THE CART ////////////
//////////////////////////////////*/
////
/////
/////
////
////
/////
/////
//////// DISPLAY FUNCTIONS /////////
////////////////////////////////////
////////////////////////////////////

function displayAvailableBeer(beer) {
  console.log("displayAvailableBeer");
  const className = beer;
  const noSpace = className.toLowerCase().replace(" ", "");
  const noSpacesAtAll = noSpace.replace(" ", "");
  document.querySelectorAll(".wrapper").forEach((e) => {
    if (e.classList[2] == noSpacesAtAll) {
      e.classList.remove("disabled");
    }
    setTimeout(() => {
      if (e.classList[0] == "disabled") {
        e.classList.add("hide");
      }
    }, 100);
  });
}

function displayProducts(beer) {
  console.log("displayProducts");
  amount = "0";
  const dot = beer.label.toString().indexOf(".");
  const labelName = beer.label.toString().substring(0, dot);
  //Put name as class on parent article to differentiate
  const className = beer.name;
  const noSpace = className.toLowerCase().replace(" ", "");
  const noSpacesAtAll = noSpace.replace(" ", "");
  const clone = document.querySelector(".products_sold").content.cloneNode(true);
  clone.querySelector(".wrapper").classList.add(noSpacesAtAll);
  clone.querySelector(".name").textContent = beer.name;
  clone.querySelector(".beer_category").textContent = beer.category;
  clone.querySelector(".price").textContent = "40 DKK";
  clone.querySelector(".product_details .label").src = "images/labels/" + labelName + ".jpg";
  clone.querySelector(".product_details .label").alt = beer.name;
  clone.querySelector(".product_details .aroma").textContent = beer.aroma;
  clone.querySelector(".product_details .alc").textContent = beer.alcohol + "%";
  clone.querySelector(".products .amount_chosen").textContent = "";
  clone.querySelector(".add").addEventListener("click", function () {
    filter = beer.name;
    amount++;
    setAmount(this, 1);
  });
  clone.querySelector(".remove").addEventListener("click", function () {
    filter = beer.name;
    amount--;
    setAmount(this, -1);
  });
  clone.querySelector(".more").addEventListener("click", function () {
    document.querySelector(".more_container").classList.remove("hide");
    setTimeout(() => {
      document.querySelector(".more_container").classList.remove("hidden_left");
      document.querySelector(".more_container").classList.add("show");
    }, 300);
    filter = beer.name;
    displayReadMore(beer);
  });
  document.querySelector(".order_container").appendChild(clone);
}

function displayReadMore(beer) {
  console.log("displayReadMore");
  document.querySelector(".order_container").classList.add("fadeOut");
  setTimeout(() => {
    document.querySelector(".order_container").classList.add("hide");
  }, 500);
  const dot = beer.label.toString().indexOf(".");
  const labelName = beer.label.toString().substring(0, dot);
  if (beer.name == filter) {
    document.querySelector(".more_container .name").textContent = beer.name;
    document.querySelector(".more_container .cat").textContent = beer.category;
    document.querySelector(".more_container .alc").textContent = beer.alcohol + "%";
    document.querySelector(".more_container .aroma").textContent = beer.aroma;
    document.querySelector(".more_container .appearance").textContent = beer.appearance;
    document.querySelector(".more_container .mouth_feel").textContent = beer.mouthfeel;
    document.querySelector(".more_container .flavor").textContent = beer.flavor;
    document.querySelector(".more_container .overall").textContent = beer.overall;
    document.querySelector(".more_container .label").src = "images/labels/" + labelName + ".jpg";
  }
}

function displayAmount(param, clicked, el) {
  console.log("displayAmount");
  if (param == 0) {
    clicked.parentNode.previousElementSibling.querySelector(".amount_chosen").textContent = "";
    clicked.parentNode.previousElementSibling.querySelector(".times").classList.add("hide");
  } else {
    clicked.parentNode.previousElementSibling.querySelector(".amount_chosen").textContent = el.amount;
    clicked.parentNode.previousElementSibling.querySelector(".times").classList.remove("hide");
  }
}

/*//////////////////////////////////
////////////// SUMMARY ////////////
//////////////////////////////////*/
////
/////
/////
////
////
/////
/////
////// MODEL/DISPLAY FUNCTIONS /////
////////////////////////////////////
////////////////////////////////////

function setSummary() {
  console.log("Summary");
  document.querySelector(".result").classList.remove("hide");
  document.querySelector(".order_container").classList.add("hide");
  document.querySelector(".cart").classList.remove("hide");
  document.querySelector(".cart").classList.remove("fadeOut");
  document.querySelector(".cart").classList.add("fadeInRight");
  document.querySelector(".result_list").innerHTML = "";

  amountArray.forEach((ordered) => {
    if (ordered.amount > 0) {
      total_price += ordered.amount * 40;
      total_amount += ordered.amount;
      const clone = document.querySelector(".cart_sumup").content.cloneNode(true);
      clone.querySelector(".article").textContent = ordered.name;
      clone.querySelector(".amount").textContent = ordered.amount + " pcs.";
      clone.querySelector(".final_amount").textContent = ordered.amount * 40 + " DKK";
      document.querySelector(".result_list").appendChild(clone);

      order = createHerokuObject(ordered);
      setTimeout(() => {
        orderDetails = createRestDbObject(ordered, total_price);
      }, 100);
      document.querySelectorAll(".pin input").forEach((el) => {
        el.addEventListener("keyup", function () {
          updateUserAndPass(ordered);
        });
      });
    }
  });
  displaySummary();
}

function displaySummary() {
  //if there is nothing in the cart else...
  console.log("displaySummary");
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

function createHerokuObject(ordered) {
  console.log("createHerokuObject");
  const herokuObject = Object.create(Product);
  herokuObject.name = ordered.name;
  herokuObject.amount = ordered.amount;
  herokuArray.push(herokuObject);
  return herokuArray;
}

function createRestDbObject(ordered) {
  console.log("createRestDbObject");
  restDbObject = Object.create(Product);
  restDbObject.name = ordered.name;
  restDbObject.amount = ordered.amount;
  restDbObject.price = ordered.amount * 40;
  restDbObject.total_beer = amount;
  restDbObject.order_number = theId;
  restDbObject.date = todayDate;
  restDbObject.total_price = total_price;
  console.table(restDbObject);
  document.querySelector(".pay").addEventListener("click", function () {
    document.querySelector(".pay").classList.add("disabled");
    //timeout so that restDB can check user if needed.
    setTimeout(() => {
      if (formIsValid && isUserValid && isValid == true) {
        createRestDbArray(ordered);
      }
    }, 2000);
  });
  return restDbObject;
}

/*//////////////////////////////////
////////////// PAYMENT ////////////
//////////////////////////////////*/
////
/////
/////
////
////
/////
/////
///////// MODEL FUNCTIONS //////////
////////////////////////////////////
////////////////////////////////////

function logInOrSignUp() {
  console.log("logInOrSignUp");
  document.querySelectorAll(".radio").forEach((radio) => {
    radio.addEventListener("change", function () {
      const login = document.querySelector("#has_account").checked;
      const noAccount = document.querySelector("#no_account").checked;
      const newAccount = document.querySelector("#new_account").checked;
      document.querySelector("#username").classList.remove("invalid");
      document.querySelector("#password").classList.remove("invalid");
      document.querySelector("#mail").classList.remove("invalid");
      document.querySelector("#secure_pass").classList.remove("invalid");
      document.querySelector(".invalid_password").classList.add("hide");
      document.querySelector(".invalid_password2").classList.add("hide");
      document.querySelector(".invalid_user").classList.add("hide");
      document.querySelector(".invalid_mail").classList.add("hide");

      if (login || newAccount) {
        document.querySelector("#username").setAttribute("required", "");
        document.querySelector(".username").classList.remove("hide");
        document.querySelector("#password").setAttribute("required", "");
        document.querySelector(".password").classList.remove("hide");
      }
      if (login) {
        console.log("log in");
        document.querySelector("#mail").removeAttribute("required");
        document.querySelector(".mail").classList.add("hide");
      }
      if (login || noAccount) {
        console.log("log in");
        document.querySelector("#secure_pass").removeAttribute("required");
        document.querySelector(".secure_pass").classList.add("hide");
      }
      if (newAccount) {
        console.log("create account");
        document.querySelector("#secure_pass").setAttribute("required", "");
        document.querySelector(".secure_pass").classList.remove("hide");
        document.querySelector(".explain_mail").textContent = " || For your log in details";
      }

      if (newAccount || noAccount) {
        document.querySelector("#mail").setAttribute("required", "");
        document.querySelector(".mail").classList.remove("hide");
      }
      if (noAccount) {
        console.log("no account");
        document.querySelector("#password").removeAttribute("required");
        document.querySelector(".password").classList.add("hide");

        document.querySelector("#username").removeAttribute("required");
        document.querySelector(".username").classList.add("hide");
        document.querySelector(".explain_mail").textContent = " || For your receipt";
      }
    });
  });
}

function checkIfValid(e) {
  console.log("checkIfValid");
  const d = new Date();
  const year = d.getFullYear();
  e.preventDefault();
  const forElements = form.querySelectorAll("input");

  forElements.forEach((el) => {
    el.classList.remove("invalid");
    if (document.querySelector("#year").value < year.toString().substring(2, 4)) {
      document.querySelector("#year").classList.add("invalid");
    }
  });
  formIsValid = matchPassWord();
  checkUser();
}

function matchPassWord() {
  console.log("matchPassWord");
  const password1 = document.querySelector("#password").value;
  const password2 = document.querySelector("#secure_pass").value;
  const login = document.querySelector("#has_account").checked;
  const noAccount = document.querySelector("#no_account").checked;

  if (login || noAccount || password2 === password1) {
    console.log("login/noAccount (which means valid)");
    formIsValid = true;
    document.querySelector(".invalid_password2").classList.add("hide");
    document.querySelector(".secure_pass .invalid_text").classList.add("hide");
    document.querySelector(".secure_pass").classList.remove("invalid");
  } else {
    formIsValid = false;
    document.querySelector(".invalid_password2").classList.remove("hide");
    document.querySelector(".secure_pass .invalid_text").classList.remove("hide");
    document.querySelector(".secure_pass").classList.add("invalid");
  }
  return formIsValid;
}

async function checkUser() {
  console.log("checkUser");
  const login = document.querySelector("#has_account").checked;
  const noAccount = document.querySelector("#no_account").checked;
  const newAccount = document.querySelector("#new_account").checked;
  const username = document.querySelector("#username").value;
  const password = document.querySelector("#password").value;
  let response = await fetch(restDb, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  });
  let data = await response.json();
  let user;
  let pass;

  if (login) {
    console.log("login");
    data.forEach((order) => {
      if (user == true && pass == true) {
        isUserValid = true;
        document.querySelector("#password").classList.remove("invalid");
        console.log("user and pass are true");
      } else if (order.username == username) {
        console.log("Username correct");
        user = true;
        document.querySelector("#username").classList.remove("invalid");
        if (order.username == username && order.password == password) {
          console.log("username and password correct");
          document.querySelector("#password").classList.remove("invalid");
          pass = true;
          user = true;
          isUserValid = true;
        } else {
          console.log("password incorrect");
          document.querySelector("#password").classList.add("invalid");
          isUserValid = false;
        }
      } else {
        console.log("username incorrect");
        document.querySelector("#username").classList.add("invalid");
        isUserValid = false;
      }
    });
  } else if (noAccount || newAccount) {
    console.log("create login/no login");
    isUserValid = true;
  }
  console.log(isUserValid);
  checkIfAllIsValid();
}

function checkIfAllIsValid() {
  console.log("checkIfAllIsValid");
  const forElements = form.querySelectorAll("input");
  const noAccount = document.querySelector("#no_account").checked;
  if (noAccount) {
    console.log("noAccount");
    document.querySelector("#password").removeAttribute("pattern");
  } else if (!noAccount) {
    let requirement = "^(?=.*[0-9])(?=.*[A-Z]).{6,}";
    document.querySelector("#password").setAttribute("pattern", requirement);
  }
  isValid = form.checkValidity();
  console.log(isValid);
  console.log(formIsValid);
  console.log(isUserValid);
  if (isValid && formIsValid && isUserValid == true) {
    payDelegation();
    displayThankYou();
  } else {
    forElements.forEach((el) => {
      if (!el.checkValidity()) {
        console.log("invalid");
        console.log(el);
        el.classList.add("invalid");
      }
    });
    setInvalid();
  }
  document.querySelector(".pay").classList.remove("disabled");
}

function setInvalid() {
  console.log("setInvalid");
  const creditNum = document.querySelector("#number");
  const creditValue = document.querySelector("#number").value.toString();
  const month = document.querySelector("#month");
  const year = document.querySelector("#year");
  const cvc = document.querySelector("#secure");
  const name = document.querySelector("#full_name");
  const mail = document.querySelector("#mail");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");

  if (creditValue.startsWith("34") || creditValue.startsWith("37") || creditValue.startsWith("38") || creditValue.startsWith("36")) {
    document.querySelector(".invalid_creditcard").classList.remove("hide");
    document.querySelector(".invalid_creditcard").textContent = "We do not accept American Express";
  } else if (creditNum.classList[1] == "invalid" || creditNum.classList[2] == "invalid" || creditNum.classList[0] == "invalid" || creditNum.classList[3] == "invalid" || creditNum.classList[4] == "invalid") {
    document.querySelector(".invalid_creditcard").classList.remove("hide");
    document.querySelector(".invalid_creditcard").textContent = "You need to fill out 16 digits for the credit card";
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
  if (mail.classList[0] == "invalid" || mail.classList[1] == "invalid") {
    document.querySelector(".invalid_mail").classList.remove("hide");
    if (document.querySelector("#new_account").checked) {
      document.querySelector(".mail>.star").classList.add("on_new_account");
      document.querySelector(".mail>.star").classList.remove("on_no_account");
    } else {
      document.querySelector(".mail>.star").classList.add("on_no_account");
      document.querySelector(".mail>.star").classList.remove("on_new_account");
    }
  } else {
    document.querySelector(".invalid_mail").classList.add("hide");
  }
  if (username.classList[0] == "invalid") {
    document.querySelector(".invalid_user").classList.remove("hide");
    if (username.value.length < 5) {
      document.querySelector(".invalid_user").textContent = "Type at least 5 characters for the user name";
    } else {
      document.querySelector(".invalid_user").textContent = "The username does not match an existing user";
    }
  } else {
    document.querySelector(".invalid_user").classList.add("hide");
  }
  if (password.classList[0] == "invalid") {
    document.querySelector(".invalid_password").classList.remove("hide");
    let requirement = "^(?=.*[0-9])(?=.*[A-Z]).{6,}";
    if (!password.value.match(requirement)) {
      console.log("does NOT meets requirement");
      document.querySelector(".invalid_password").textContent = "The password has to contain 6 charachters, one uppercase letter and one number";
    } else {
      console.log(password.value.length);
      document.querySelector(".invalid_password").textContent = "The password does not match the user.";
    }
  } else {
    document.querySelector(".invalid_password").classList.add("hide");
  }
}
function updateUserAndPass() {
  console.log("updateUserAndPass");
  username_value = document.querySelector("#username").value;
  password_value = document.querySelector("#password").value;
  email_value = document.querySelector("#mail").value;
}

function createRestDbArray(ordered) {
  console.log("createRestDbArray");
  username_value = document.querySelector("#username").value;
  password_value = document.querySelector("#password").value;
  email_value = document.querySelector("#mail").value;
  restDbObject = Object.create(Product);
  restDbObject.name = ordered.name;
  restDbObject.amount = ordered.amount;
  restDbObject.price = ordered.amount * 40;
  restDbArray.push(restDbObject);
  console.table(restDbObject);
  console.table(restDbArray);
}
async function postHeroku() {
  console.log("postHeroku");
  //POST object to heroku DB
  const postData = JSON.stringify(order);
  let response = await fetch(endpoint + "order", {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: postData,
  });
  data = await response.json();
  theId = data.id;
  console.log(data.id);
  //displayThankYou();
}
async function postRestDb(payload) {
  console.log("postRestDb");
  //POST object to restDB
  const postData = JSON.stringify(payload);
  let response = await fetch(restDb, {
    method: "post",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  data = await response.json();
  console.log(data);
}

/*//////////////////////////////////
////////////// PAYMENT ////////////
//////////////////////////////////*/
////
/////
/////
////
////
/////
/////
//////// DISPLAY FUNCTIONS /////////
////////////////////////////////////
////////////////////////////////////

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

/*//////////////////////////////////
//////////// THANK YOU ////////////
//////////////////////////////////*/
////
/////
/////
////
////
/////
/////
///////// DISPLAY FUNCTIONS //////////
////////////////////////////////////
////////////////////////////////////

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
}

function displayOrderNumber() {
  console.log("displayOrderNumber");
  document.querySelector(".your_number").textContent = theId;
}
