let locationSite;
const url = "https://foobar3rdsemester.herokuapp.com/beertypes";
const endpoint = "https://foobar3rdsemester.herokuapp.com/";
const restDb = "https://frontend-22d4.restdb.io/rest/foobar";
const apiKey = "5e9581a6436377171a0c234f";
let jsonData;
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
let isUserValid;
let username_value;
let password_value;
let result;
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
};
/*//////////////////////////////////
////// DELEGATION FUNCTIONS ///////
//////////////////////////////////*/

export function cartDelegation() {
  console.log("cartDelegation");
  /*  setTimeout(() => {
    checkAvailability();
  }, 200); */
  loadJson();
  closePopUp();
  logInOrSignUp();

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

  //document.querySelector(".button_container .more").addEventListener("click", displayReadMore);
  document.querySelector(".order_nav_wrapper .reset").addEventListener("click", reset);
  document.querySelector(".view_cart").addEventListener("click", displaySummary);
  document.querySelector(".checkout").addEventListener("click", displayPayment);
  document.querySelector(".credit_card_nav .pay").addEventListener("click", (e) => {
    console.log("VALID?");
    checkIfValid(e);
  });

  //document.querySelector(".thank_you_nav .home").addEventListener("click", checkValidity);
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
  updateCounter();
  console.log(order);
  console.table(orderDetails);

  postHeroku();
  setTimeout(() => {
    console.log(theId);
    displayOrderNumber();
  }, 1300);
  setTimeout(() => {
    console.log(theId);
    displayOrderNumber();
  }, 2000);
  setTimeout(() => {
    console.log(todayDate);
    postRestDb({
      order_number: theId,
      time: today.getTime(),
      total_beer: amount,
      total_price: total_price,
      username: username_value,
      password: password_value,
      date: todayDate,
      restDbArray,
    });
  }, 2000);
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
      location.href = "order.html";
      document.querySelector(".order_container").classList.remove("hide");
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
      setTimeout(() => {
        location.href = "order.html";
      }, 500);
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

async function checkAvailability() {
  console.log("checkAvailability");
  let beerArray = [];
  let beerName = {};

  //if some tabs are empty
  let response = await fetch(endpoint, {
    method: "get",
  });
  data = await response.json();
  console.log(data.taps);

  data.storage.forEach((beer) => {
    beerName = beer.name;
    beerArray.push(beerName);
  });
  console.log(beerArray);
  beerArray.forEach((e) => {
    for (let i = 0; i < data.taps.length; i++) {
      // console.log(data.taps[i]["beer"]);
      if (data.taps[i]["beer"] == e) {
        let availableBeer = data.taps[i]["beer"];
        console.log(availableBeer);
        displayAvailableBeer(availableBeer);
      }
    }
  });
}

async function loadJson() {
  console.log("loadJson - order.js");
  let response = await fetch(url);
  jsonData = await response.json();
  let arrayProduct = productArray;
  makeBeerObject(arrayProduct);
  setTimeout(() => {
    checkAvailability();
  }, 200);
}

function makeAmountObject() {
  console.log("makeAmountObject");
  jsonData.forEach((beer) => {
    const amountObject = Object.create(Product);
    amountObject.name = beer.name;
    amountObject.amount = amount;
    amountObject.id1 = "";
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
  const forElements = form.querySelectorAll("input");

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

  formIsValid = checkPassWord();
  checkUser();
}

async function checkUser() {
  console.log("checkUser");
  const login = document.querySelector("#has_account").checked;
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
  console.log(data);
  console.log(result);

  if (login) {
    console.log("login");
    //Check validity

    data.forEach((order) => {
      if (user == true) {
        console.log("Username correct");
        if (order.password == password) {
          console.log("username and password correct");
          isUserValid = true;
        } else {
          console.log("password incorrect");
          document.querySelector("#password").classList.add("invalid");
          isUserValid = false;
        }
      } else if (user == undefined) {
        if (order.username == username) {
          console.log("Username correct");
          user = true;
          document.querySelector("#username").classList.remove("invalid");
          if (order.username == username && order.password == password) {
            console.log("username and password correct");
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
      }
    });
  } else {
    console.log("create login");
    isUserValid = true;
  }
  console.log(isUserValid);
  checkIfAllIsValid();
}

function checkIfAllIsValid() {
  console.log("checkIfAllIsValid");
  const forElements = form.querySelectorAll("input");
  const isValid = form.checkValidity();
  const creditNum = document.querySelector("#number");
  const month = document.querySelector("#month");
  const year = document.querySelector("#year");
  const cvc = document.querySelector("#secure");
  const name = document.querySelector("#full_name");
  const username = document.querySelector("#username");
  const password = document.querySelector("#password");
  console.log(isValid);
  console.log(formIsValid);
  console.log(isUserValid);
  if (isValid && formIsValid && isUserValid == true) {
    //post();

    console.log("all good");
    setTimeout(() => {
      form.reset();
    }, 2000);
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
      let requirement = /(?=.*\d)(?=.*[A-Z]).{6,}/;
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
  console.log("submitted");
}

function updateCounter() {
  console.log("updateCounter");
  //PUT beer ordered
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

/*
////////////////////////////////////
////// RETURN FUNCTIONS ///////
//////////////////////////////////*/

function checkPassWord() {
  console.log("password");
  let formIsValid;
  const password1 = document.querySelector("#password").value;
  const password2 = document.querySelector("#secure_pass").value;
  const login = document.querySelector("#has_account").checked;

  if (login) {
    console.log("login (which means vilid)");
    formIsValid = true;
    document.querySelector(".secure_pass .invalid_text").classList.add("hide");
    document.querySelector(".invalid_password2").classList.add("hide");
    document.querySelector(".secure_pass").classList.remove("invalid");
  } else {
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
  restDbObject.username = document.querySelector("#username").value;
  restDbObject.password = document.querySelector("#password").value;
  restDbObject.order_number = theId;
  restDbObject.date = todayDate;
  restDbObject.total_price = total_price;
  console.table(restDbObject);
  document.querySelector(".pay").addEventListener("click", function () {
    setTimeout(() => {
      if (formIsValid && isUserValid == true) {
        createRestDbArray(ordered);
      }
    }, 3000);
  });

  return restDbObject;
}

function createRestDbArray(ordered) {
  console.log("createRestDbArray");
  username_value = document.querySelector("#username").value;
  password_value = document.querySelector("#password").value;
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
  console.log(data);
  displayThankYou();
  setTimeout(() => {
    getHeroku();
  }, 700);
}

async function getHeroku() {
  console.log("getHeroku");
  //GET the just placed order (order number)
  let response = await fetch(endpoint, {
    method: "get",
  });
  data = await response.json();
  theId = data.queue[0]["id"];
}

/*
////////////////////////////////////
////// DISPLAY FUNCTIONS ///////
//////////////////////////////////*/

function displayAvailableBeer(beer) {
  console.log("displayAvailableBeer");
  const className = beer;
  const noSpaces = className.toLowerCase().replace(" ", "");
  const noSpacesAtAll = noSpaces.replace(" ", "");
  console.log(noSpacesAtAll);
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

function displayReadMore() {
  console.log("displayReadMore");
  document.querySelector(".order_container").classList.add("fadeOut");
  setTimeout(() => {
    document.querySelector(".order_container").classList.add("hide");
  }, 500);
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
  //Put name as class on parent article to differentiate
  const className = beer.name;
  const noSpaces = className.toLowerCase().replace(" ", "");
  const noSpacesAtAll = noSpaces.replace(" ", "");
  const clone = document.querySelector(".products_sold").content.cloneNode(true);
  clone.querySelector(".wrapper").classList.add(noSpacesAtAll);
  clone.querySelector(".name").textContent = beer.name;
  clone.querySelector(".beer_category").textContent = beer.category;
  clone.querySelector(".price").textContent = "40 DKK";
  clone.querySelector(".product_details .label").src = "images/labels/" + beer.label;
  clone.querySelector(".product_details .label").alt = beer.name;
  clone.querySelector(".product_details .aroma").textContent = beer.aroma;
  clone.querySelector(".product_details .alc").textContent = beer.alcohol + "%";
  clone.querySelector(".products .amount_chosen").textContent = "";

  clone.querySelector(".add").addEventListener("click", function () {
    filter = beer.name;
    console.log(filter);
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
    displayReadMore();
  });

  document.querySelector(".order_container").appendChild(clone);
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

function displaySummary() {
  console.log("displaySummary");
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
      clone.querySelector(".final_amount").textContent = total_price + " DKK";
      document.querySelector(".result_list").appendChild(clone);

      order = createHerokuObject(ordered);
      console.log(order);
      orderDetails = createRestDbObject(ordered, total_price);
    }
  });

  //if there is nothing in the cart else...
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
  setTimeout(() => {
    reset();
  }, 8000);
  setTimeout(() => {
    restDbArray = [];
    restDbObject = {};
    herokuArray = [];
  }, 3000);
}

function displayOrderNumber() {
  console.log("displayOrderNumber");
  document.querySelector(".your_number").textContent = theId;
}
