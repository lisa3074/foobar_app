const HTML = {};

const Win = {
  servedToday: "",
};

export async function getData() {
  HTML.url = "https://foobar3exam.herokuapp.com/";
  HTML.winUrl = "https://frontend-22d4.restdb.io/rest/winner";
  HTML.apiKey = "5e9581a6436377171a0c234f";
  HTML.beforeLastServed;
  HTML.theWinner;
  console.log("getData");
  console.log("loadJson");
  let response = await fetch(HTML.url);
  let jsonData = await response.json();
  makeObjects(jsonData);
}

function makeObjects(jsonData) {
  console.log("makeObjects");
  const winObject = Object.create(Win);
  console.log(jsonData);
  winObject.serving1 = JSON.parse(jsonData.bartenders[0]["servingCustomer"]);
  winObject.serving2 = JSON.parse(jsonData.bartenders[1]["servingCustomer"]);
  winObject.serving3 = JSON.parse(jsonData.bartenders[2]["servingCustomer"]);
  winObject.servedToday = Math.max(winObject.serving1, winObject.serving2, winObject.serving3);
  setData(winObject);
}

function setData(winObject) {
  console.log("setData");
  let servedToday = winObject.servedToday;
  let winsNow = Math.floor(servedToday / 100);
  let percentUntilWin;
  if (servedToday == 0) {
    servedToday = HTML.beforeLastServed;
  }
  if (servedToday < 100) {
    percentUntilWin = servedToday;
  } else if (servedToday < 1000) {
    const thePercentage = servedToday.toString();
    console.log(servedToday);
    percentUntilWin = thePercentage.substring(1, 3);
  } else {
    const thePercentage = servedToday.toString();
    console.log(servedToday);
    percentUntilWin = thePercentage.substring(2, 4);
  }

  if (percentUntilWin > "95" && percentUntilWin < "99") {
    const minus100 = servedToday - 99;
    let winner = setWinner(minus100, servedToday);
    console.log(winner);
    setTimeout(() => {
      put({ winner_number: winner });
    }, 500);
  }
  const ordersLeft = 100 - percentUntilWin;
  getWinner(percentUntilWin);
  displayProgress(percentUntilWin);
  displayData(winsNow, ordersLeft), percentUntilWin;
}
function setWinner(min, max) {
  if (min < 0) {
    min = 0;
  } else {
    let random = Math.floor(Math.random() * (max - min)) + min;
    console.log(random);
    return random;
  }
}

async function put(payload) {
  console.log("put");
  const postData = JSON.stringify(payload);
  //Sikrer det er det rigtige id der redigeres
  let response = await fetch(`${HTML.winUrl}/${"5ece601e2313157900020042"}`, {
    method: "put",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
    body: postData,
  });
  let data = await response.json();
  // console.log(data.winner_number);
}

async function getWinner(percentUntilWin) {
  console.log("getWinner");
  let response = await fetch(`${HTML.winUrl}/${"5ece601e2313157900020042"}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
  });
  let jsonData = await response.json();
  /*  console.log(jsonData);
  console.log(jsonData.winner_number); */
  HTML.theWinner = jsonData.winner_number;
  if (percentUntilWin > "00" && percentUntilWin < "95") {
    displayWinner();
  }
}

function displayProgress(percentUntilWin) {
  console.log("displayProgress");
  const path = document.querySelector(".box .percent svg circle:nth-child(2)");
  path.style.setProperty("--progress", percentUntilWin);
  document.querySelector(".win_number").textContent = percentUntilWin;
}
function displayData(winsNow, ordersLeft) {
  console.log("displayData");
  document.querySelector(".wrap:nth-child(1)>.win_smallnumbers").textContent = winsNow;
  document.querySelector(".wrap:nth-child(2)>.win_smallnumbers").textContent = ordersLeft;
  console.log(HTML.theWinner);
  setTimeout(() => {
    getData();
  }, 1000);
}

function displayWinner() {
  console.log("displayWinner");
  document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = HTML.theWinner;
  console.log(HTML.theWinner);
}
