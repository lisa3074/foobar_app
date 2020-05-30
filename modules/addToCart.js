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
let object;
let data;
let arrayProduct = [];
let total_amount = 0;
let total_price = 0;
let order;

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
////CALCULATING

export async function loadJson() {
  document.querySelector(".view_cart").addEventListener("click", displaySummary);
  console.log("loadJson - order.js");
  let response = await fetch(url);
  jsonData = await response.json();
  arrayProduct = productArray;
  makeBeerObject();
  setTimeout(() => {
    checkAvailability();
  }, 200);
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
        displayAvailableBeer(availableBeer);
      }
    }
  });
}

export function makeBeerObject() {
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
    arrayProduct.push(productObject);
  });
  object = makeAmountObject();
  fetchProducts(productArray);
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

function fetchProducts(product) {
  console.log("fetchProducts");
  document.querySelector(".order_container").innerHTML = "";
  product.forEach(displayProducts);
}

function setAmount(clicked, modifier) {
  console.log("setAmount");
  setTimeout(() => {
    document.querySelectorAll("input").forEach((input) => {
      input.classList.remove("invalid");
    });
  }, 1000);
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

////DISPLAY

function displayAvailableBeer(beer) {
  console.log("displayAvailableBeer");
  const className = beer;
  const noSpaces = className.toLowerCase().replace(" ", "");
  const noSpacesAtAll = noSpaces.replace(" ", "");
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
  });
}

function displayProducts(beer) {
  console.log("displayProducts");
  amount = "0";
  const dot = beer.label.toString().indexOf(".");
  const labelName = beer.label.toString().substring(0, dot);
  //Put name as class on parent article to differentiate
  const className = beer.name;
  const noSpaces = className.toLowerCase().replace(" ", "");
  const noSpacesAtAll = noSpaces.replace(" ", "");
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

export function displaySummary() {
  console.log("displaySummary");
  document.querySelector(".result").classList.remove("hide");
  document.querySelector(".order_container").classList.add("hide");
  document.querySelector(".cart").classList.remove("hide");
  document.querySelector(".cart").classList.remove("fadeOut");
  document.querySelector(".cart").classList.add("fadeInRight");
  document.querySelector(".result_list").innerHTML = "";

  console.log(amountArray);
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
      console.log(order);
      setTimeout(() => {
        orderDetails = createRestDbObject(ordered, total_price);
      }, 100);
      document.querySelectorAll(".pin input").forEach((el) => {
        el.addEventListener("keyup", function () {
          restDbObject = {};
          console.log(order[0]);
          fillRestDbObject(ordered);
          //checkIfAllIsValid();
        });
      });
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
