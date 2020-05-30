import { loadJson } from "./addToCart";
import { displaySummary } from "./addToCart";
let locationSite;
const url = "https://foobar3exam.herokuapp.com/beertypes";
const endpoint = "https://foobar3exam.herokuapp.com/";
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

  document.querySelector(".order_nav_wrapper .reset").addEventListener("click", function () {
    location.href = "order.html";
  });
  //document.querySelector(".view_cart").addEventListener("click", displaySummary);
  document.querySelector(".checkout").addEventListener("click", displayPayment);
  document.querySelector(".credit_card_nav .pay").addEventListener("click", (e) => {
    console.log("VALID?");
    checkIfValid(e);
  });
  document.querySelectorAll(".credit_card input").forEach((el) => {
    el.addEventListener("keyup", function () {
      console.log("remove invalid");
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
            console.log("remove invalid");
            el.classList.remove("invalid");
            setInvalid();
          });
        }
      });
    });
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
      /*   document.querySelector(".order_container").classList.remove("hide");
      window.scrollTo(0, 0);
      document.querySelector(".cart").classList.add("fadeOut");
      document.querySelector(".cart").classList.remove("fadeInRight");
      total_price = 0;
      total_amount = 0; */
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
  /*  document.querySelectorAll(".cart_close").forEach((cross) => {
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
  }); */
}

function logInOrSignUp() {
  console.log("form");

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
        // document.querySelector(".invalid_password2").classList.add("hide");
        document.querySelector("#secure_pass").removeAttribute("required");
        document.querySelector(".secure_pass").classList.add("hide");

        // document.querySelector(".invalid_mail").classList.add("hide");
        document.querySelector("#mail").removeAttribute("required");
        document.querySelector(".mail").classList.add("hide");
      }
      if (newAccount) {
        console.log("create account");
        document.querySelector("#secure_pass").setAttribute("required", "");
        document.querySelector(".secure_pass").classList.remove("hide");

        document.querySelector("#mail").setAttribute("required", "");
        document.querySelector(".mail").classList.remove("hide");
        document.querySelector(".explain_mail").textContent = " || For your log in details";
      }
      if (noAccount) {
        console.log("no account");
        //document.querySelector(".invalid_password2").classList.add("hide");
        document.querySelector(".secure_pass").classList.add("hide");
        document.querySelector("#secure_pass").removeAttribute("required");

        //document.querySelector(".invalid_password").classList.add("hide");
        document.querySelector("#password").removeAttribute("required");
        document.querySelector(".password").classList.add("hide");

        //document.querySelector(".invalid_user").classList.add("hide");
        document.querySelector("#username").removeAttribute("required");
        document.querySelector(".username").classList.add("hide");

        document.querySelector("#mail").setAttribute("required", "");
        document.querySelector(".mail").classList.remove("hide");
        document.querySelector(".explain_mail").textContent = " || For your receipt";
      }
    });
  });
}

function checkIfValid(e) {
  console.log("checkIfValid");
  // form.setAttribute("novalidate", true);
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
  formIsValid = checkPassWord();
  checkUser();
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
  console.log(data);

  if (login) {
    console.log("login");
    //Check validity

    data.forEach((order) => {
      if ((user == true && pass == true) || isUserValid == true) {
        isUserValid = true;
        document.querySelector("#password").classList.remove("invalid");
        console.log("user and pass are true");
      } else if (user == true) {
        user = true;
        console.log("Username correct");
        if (order.password == password) {
          console.log("username and password correct");
          document.querySelector("#password").classList.remove("invalid");
          pass = true;
          user = true;
          isUserValid = true;
        } else if (!pass) {
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
            document.querySelector("#password").classList.remove("invalid");
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
  } else if (noAccount || newAccount) {
    console.log("create login");
    isUserValid = true;
  }
  console.log(isUserValid);
  checkIfAllIsValid();
}

function checkIfAllIsValid() {
  console.log("checkIfAllIsValid");
  const forElements = form.querySelectorAll("input");
  isValid = form.checkValidity();
  console.log(isValid);
  console.log(formIsValid);
  console.log(isUserValid);
  if (isValid && formIsValid && isUserValid == true) {
    //post();

    console.log("all good");
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
    setInvalid();
  }
  console.log("submitted");
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
  const noAccount = document.querySelector("#no_account").checked;

  if (login || noAccount) {
    console.log("login/noAccount (which means valid)");
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
  console.log(email_value);
  console.log(password_value);
  console.log(username_value);
  document.querySelector(".pay").addEventListener("click", function () {
    document.querySelector(".pay").classList.add("disabled");

    setTimeout(() => {
      if (formIsValid && isUserValid && isValid == true) {
        createRestDbArray(ordered);
      }
    }, 2000);
  });

  return restDbObject;
}

function fillRestDbObject() {
  console.log("fillRestDbObject");
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
  if (restDbArray.length > 0) {
    //restDbArray.shift();
    console.table(restDbObject);
    console.table(restDbArray);
  }
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
  displayThankYou();
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
  /*   setTimeout(() => {
    restDbArray = [];
    restDbObject = {};
    herokuArray = [];
  }, 3000); */
}

function displayOrderNumber() {
  console.log("displayOrderNumber");
  document.querySelector(".your_number").textContent = theId;
}
