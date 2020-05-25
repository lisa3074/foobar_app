const url = "https://foobar3rdsemester.herokuapp.com/";
let beforeLastServed;
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
  let winner;
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
    const minus100 = servedToday - 100;
    winner = getWinner(minus100, servedToday);
    now = new Date().getTime(); // Time in milliseconds
    if (now - lastTime > 20000) {
      hasDelayBeenExecuted = true;
      lastTime = now;
    } else {
      hasDelayBeenExecuted = false;
    }
    // rest of function
  }
  const ordersLeft = 100 - percentUntilWin;
  displayProgress(percentUntilWin);
  displayData(winsNow, ordersLeft, winner, hasDelayBeenExecuted);
}
function getWinner(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
function displayProgress(percentUntilWin) {
  const path = document.querySelector(".box .percent svg circle:nth-child(2)");
  path.style.setProperty("--progress", percentUntilWin);
  console.log("displayProgress");
  document.querySelector(".win_number").textContent = percentUntilWin;
  //vis animation
}
function displayData(winsNow, ordersLeft, winner, hasDelayBeenExecuted) {
  const winnerText = document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent;
  console.log("displayData");
  document.querySelector(".wrap:nth-child(1)>.win_smallnumbers").textContent = winsNow;
  document.querySelector(".wrap:nth-child(2)>.win_smallnumbers").textContent = ordersLeft;
  if (hasDelayBeenExecuted) {
    if (winnerText == "") {
      document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = "?";
    } else {
      document.querySelector(".wrap:nth-child(3)>.win_smallnumbers").textContent = winner;
    }
  }

  //vis info numre
  setTimeout(() => {
    getData();
  }, 1000);
}
