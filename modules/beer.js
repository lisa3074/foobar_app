const url = "https://foobar3exam.herokuapp.com/beertypes";
export async function loadJsonBeer() {
  console.log("loadJson - beer.js");
  let response = await fetch(url);
  let jsonData = await response.json();
  fetchList(jsonData);
}

function fetchList(data) {
  console.log("fetchList");
  document.querySelector(".beer_container").innerHTML = "";
  data.forEach(displayBeers);
}
function displayBeers(data) {
  console.log("displayBeers");

  const clone = document.querySelector(".product_temp").content.cloneNode(true);
  const dot = data.label.toString().indexOf(".");
  const labelName = data.label.toString().substring(0, dot);
  clone.querySelector(".name").textContent = data.name;
  clone.querySelector(".beer_alc").textContent = data.alc + "%";
  clone.querySelector(".beer_cat").textContent = data.category;
  clone.querySelector(".label").src = "images/labels/" + labelName + ".jpg";
  clone.querySelector(".label").alt = data.name;
  clone.querySelector(".aroma").textContent = data.description.aroma;
  clone.querySelector(".appearance").textContent = data.description.appearance;
  clone.querySelector(".mouth_feel").textContent = data.description.mouthfeel;
  clone.querySelector(".flavour").textContent = data.description.flavor;
  clone.querySelector(".overall").textContent = data.description.overallImpression;

  /*  clone.querySelector(".buy_beer").addEventListener("click", function () {
    location.href = "order.html";
  }); */

  document.querySelector(".beer_container").appendChild(clone);
}
