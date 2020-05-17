const url = "https://foobar3rdsemester.herokuapp.com/";
const array = [];
let jsonData;
let beforeLastServed;
let oldBeerCount = 0;
//let beerCount;

const Queue = {
  queueNumber: "",
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
  console.log("makeObjects");
  const foobarObject = Object.create(Queue);
  console.log(jsonData);
  foobarObject.queueNumber = jsonData.queue.length;
  foobarObject.serving1 = JSON.parse(jsonData.bartenders[0]["servingCustomer"]);
  foobarObject.serving2 = JSON.parse(jsonData.bartenders[1]["servingCustomer"]);
  foobarObject.serving3 = JSON.parse(jsonData.bartenders[2]["servingCustomer"]);
  foobarObject.servedToday = Math.max(foobarObject.serving1, foobarObject.serving2, foobarObject.serving3);
  if (foobarObject.queueNumber > 0) {
    foobarObject.orderNumber = JSON.parse(jsonData.queue[0]["id"]);
    foobarObject.loggedAt = JSON.parse(jsonData.queue[0]["startTime"]);

    //checks how many beer were ordered in each order to get the full number of ordered beers (only works until reload)
    for (let i = 0; i < foobarObject.queueNumber; i++) {
      foobarObject.order = jsonData.queue[i].order.length;
      oldBeerCount += foobarObject.order;
      console.log(oldBeerCount);
    }
  }
  foobarObject.beerCount = oldBeerCount;

  //foobarObject.beingPoured = jsonData.bartenders.servingCustomer;
  console.log(foobarObject);
  loops(foobarObject);
}
function loops(foobarObject) {
  console.log("loops");
  const queue = foobarObject.queueNumber;
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
    const timeStamp = document.querySelector(".time");
    const queueNow = document.querySelector(".queue_num");
    const served = document.querySelector(".served_today");
    const wins = document.querySelector(".wins_today");

    //Convert time from milliseconds
    const time = new Date().getTime();
    const date = new Date(time);
    let rightTime = date.toString();
    //Make sure I only get the time
    const theRightIime = rightTime.substring(15, 21);

    //The first bar (for animation)
    document.querySelector(".wrap:nth-child(1) > .q_bar").classList.add("nullHeight");
    //The other bars
    const bar = document.querySelector(`.queue_box > .wrap:nth-child(${number + 1}) > .q_bar`);
    const barNum = document.querySelector(`.queue_box > .wrap:nth-child(${number + 1}) > .q_num`);
    bar.style.setProperty("--height", array[number]);

    //console.log(array[number]);
    let winsNow = Math.floor(foobarObject.servedToday / 100);
    if (foobarObject.servedToday == 0) {
      foobarObject.servedToday = beforeLastServed;
    }
    timeStamp.textContent = theRightIime;
    queueNow.textContent = foobarObject.queueNumber;
    barNum.textContent = array[number];
    wins.textContent = winsNow;
    served.textContent = foobarObject.servedToday;
    beforeLastServed = foobarObject.servedToday;
  }
  setTimeout(() => {
    loadJson();
    document.querySelector(".wrap:nth-child(1) > .q_bar").classList.remove("nullHeight");
    document.querySelector(".wrap:nth-child(1) > .q_bar").classList.add("fullHeight");
  }, 10000);
}
