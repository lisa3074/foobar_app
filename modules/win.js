const url = "https://foobar3exam.herokuapp.com/";
const winUrl = "https://frontend-22d4.restdb.io/rest/winner";
const apiKey = "5e9581a6436377171a0c234f";
let beforeLastServed;
let theWinner;
let lastTime = 0;

//let jsonData;
const Win = {
  servedToday: "",
};

export async function getData() {
  console.log("getData");
  console.log("loadJson");
  let response = await fetch(url);
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
  let hasDelayBeenExecuted;
  let now;
  if (servedToday == 0) {
    servedToday = beforeLastServed;
  }
  console.log(beforeLastServed);
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

  if (percentUntilWin == "00") {
    const minus100 = servedToday - 99;
    let winner = setWinner(minus100, servedToday);
    now = new Date().getTime(); // Time in milliseconds
    if (now - lastTime > 40000) {
      hasDelayBeenExecuted = true;
      lastTime = now;
    } else {
      hasDelayBeenExecuted = false;
    }
    put(
      { winner_number: winner },
      //id is send to put, so it's the right object that is edited.
      hasDelayBeenExecuted
    );
    // rest of function
  }
  const ordersLeft = 100 - percentUntilWin;
  getWinner();
  displayProgress(percentUntilWin);
  displayData(winsNow, ordersLeft, hasDelayBeenExecuted);
}
function setWinner(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function put(payload, hasDelayBeenExecuted) {
  console.log(hasDelayBeenExecuted);
  if (hasDelayBeenExecuted) {
    console.log("put");
    const postData = JSON.stringify(payload);
    //Sikrer det er det rigtige id der redigeres
    let response = await fetch(`${winUrl}/${"5ece601e2313157900020042"}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "x-apikey": apiKey,
        "cache-control": "no-cache",
      },
      body: postData,
    });
    //getWinner();
    //objektet ændres i db
    let data = await response.json();
    console.log(data.winner_number);
    /*  theWinner = data.winner_number; */
  }
}

async function getWinner() {
  console.log("getWinner");
  let response = await fetch(`${winUrl}/${"5ece601e2313157900020042"}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  });
  let jsonData = await response.json();
  console.log(jsonData);
  console.log(jsonData.winner_number);
  theWinner = jsonData.winner_number;
}

function displayProgress(percentUntilWin) {
  console.log("displayProgress");
  const path = document.querySelector(".box .percent svg circle:nth-child(2)");
  path.style.setProperty("--progress", percentUntilWin);
  document.querySelector(".win_number").textContent = percentUntilWin;
  //vis animation
}
function displayData(winsNow, ordersLeft) {
  //const theWinner = getWinner();
  const winnerText = document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent;
  console.log("displayData");
  document.querySelector(".wrap:nth-child(1)>.win_smallnumbers").textContent = winsNow;
  document.querySelector(".wrap:nth-child(2)>.win_smallnumbers").textContent = ordersLeft;
  if (theWinner == undefined) {
  } else {
    document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = theWinner;
  }
  console.log(theWinner);

  //vis info numre
  setTimeout(() => {
    getData();
  }, 1000);
}
