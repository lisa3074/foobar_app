const url = "https://foobar3exam.herokuapp.com/";
const array = [];
let jsonData;
let beforeLastServed;
let oldBeerCount = 0;
let lastTime = 0;
//let beerCount;

const Queue = {
  queueLength: "",
  loggedAt: "",
  servedToday: "",
};

export function indexDelegation() {
  console.log("indexDelegation");
  //SET EVENTLISTNERE TIL DE STORE IKONER
  loadJson();
}

async function loadJson() {
  console.log("loadJson");
  let response = await fetch(url);
  jsonData = await response.json();
  makeObjects();
}
function makeObjects() {
  let now;
  console.log("makeObjects");
  const foobarObject = Object.create(Queue);
  console.log(jsonData);
  foobarObject.queueLength = jsonData.queue.length;
  foobarObject.serving1 = JSON.parse(jsonData.bartenders[0]["servingCustomer"]);
  foobarObject.serving2 = JSON.parse(jsonData.bartenders[1]["servingCustomer"]);
  foobarObject.serving3 = JSON.parse(jsonData.bartenders[2]["servingCustomer"]);
  foobarObject.servedToday = Math.max(foobarObject.serving1, foobarObject.serving2, foobarObject.serving3);
  now = new Date().getTime();
  console.log(now - lastTime);
  if (now - lastTime > 1000) {
    setData(foobarObject);
  }
  if (now - lastTime > 10000) {
    if (foobarObject.queueLength > 0) {
      foobarObject.orderNumber = JSON.parse(jsonData.queue[0]["id"]);
      foobarObject.loggedAt = JSON.parse(jsonData.queue[0]["startTime"]);

      //checks how many beer were ordered in each order to get the full number of ordered beers (only works until reload)
      for (let i = 0; i < foobarObject.queueLength; i++) {
        foobarObject.order = jsonData.queue[i].order.length;
        oldBeerCount += foobarObject.order;
        console.log(oldBeerCount);
      }
    }
    foobarObject.beerCount = oldBeerCount;

    //foobarObject.beingPoured = jsonData.bartenders.servingCustomer;
    console.log(foobarObject);

    loops(foobarObject);
    lastTime = now;
  }
}
function loops(foobarObject) {
  console.log("loops");
  const queue = foobarObject.queueLength;
  array.unshift(queue);
  if (array.length <= 5) {
    console.log("under 10");
  } else {
    console.log("over 10");
    array.pop();
  }
  //console.log(array);
  displayQueue(foobarObject);
}
function displayQueue(foobarObject) {
  document.querySelector(".wrap:nth-child(1) > .q_bar").classList.remove("fullHeight");
  for (let number = 0; number < 5; number++) {
    console.log("displayQueue");
    const timeStamp = document.querySelectorAll(".time");
    const queueNow = document.querySelectorAll(".queue_num");
    const served = document.querySelectorAll(".served_today");
    const wins = document.querySelectorAll(".wins_today");

    //Convert time from milliseconds
    const time = new Date().getTime();
    const date = new Date(time);
    let rightTime = date.toString();
    //Make sure I only get the time
    const theRightIime = rightTime.substring(15, 21);

    //The first bar (for animation)
    document.querySelectorAll(".wrap:nth-child(1) > .q_bar").forEach((firstBar) => {
      firstBar.classList.add("nullHeight");
    });
    //The other bars
    const bars = document.querySelectorAll(`.queue_box > .wrap:nth-child(${number + 1}) > .q_bar`);
    const barNum = document.querySelectorAll(`.queue_box > .wrap:nth-child(${number + 1}) > .q_num`);
    bars.forEach((bar) => {
      bar.style.setProperty("--height", array[number]);
    });

    //console.log(array[number]);
    let winsNow = Math.floor(foobarObject.servedToday / 100);
    if (foobarObject.servedToday == 0) {
      foobarObject.servedToday = beforeLastServed;
    }
    timeStamp.forEach((time) => {
      time.textContent = theRightIime;
    });
    queueNow.forEach((queue) => {
      queue.textContent = foobarObject.queueLength;
    });
    barNum.forEach((num) => {
      num.textContent = array[number];
    });
    wins.forEach((win) => {
      win.textContent = winsNow;
    });
    served.forEach((served) => {
      served.textContent = foobarObject.servedToday;
    });
    beforeLastServed = foobarObject.servedToday;
  }
  setTimeout(() => {
    loadJson();
    document.querySelectorAll(".wrap:nth-child(1) > .q_bar").forEach((firstBar) => {
      firstBar.classList.remove("nullHeight");
    });
    document.querySelectorAll(".wrap:nth-child(1) > .q_bar").forEach((firstWrap) => {
      firstWrap.classList.add("fullHeight");
    });
  }, 10000);
}
function setData(winObject) {
  console.log("setData");
  let servedToday = winObject.servedToday;
  let percentUntilWin;

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

  const ordersLeft = 100 - percentUntilWin;
  displayProgress(percentUntilWin);
  displayData(ordersLeft);
}
function displayProgress(percentUntilWin) {
  console.log("displayProgress");
  const path = document.querySelectorAll("div > svg > circle:nth-child(2)");
  path.forEach((path) => {
    path.style.setProperty("--progress", percentUntilWin);
  });
  document.querySelectorAll(".win_number").forEach((number) => {
    number.textContent = percentUntilWin;
  });
}
function displayData(ordersLeft) {
  document.querySelector(".beernumber").textContent = ordersLeft;
  setTimeout(() => {
    loadJson();
  }, 1000);
}
