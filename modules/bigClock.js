const url = "https://foobar3exam.herokuapp.com/";
let count = 0;
let amount;
export function clockDelegation() {
  console.log("clockDelegation");
  getData();
}
async function getData() {
  amount = 0;
  count = 0;
  console.log("getData");
  let response = await fetch(url);
  let jsonData = await response.json();
  countBeers(jsonData);
}

function countBeers(jsonData) {
  console.log("countBeers");
  jsonData.queue.forEach((order) => {
    amount = order.order.length;
    count += amount;
  });
  jsonData.serving.forEach((order) => {
    amount = order.order.length;
    count += amount;
  });
  displayMinutes();
  setTimeout(() => {
    getData();
  }, 1000);
}
function displayMinutes() {
  console.log("displayMinutes");
  const path = document.querySelector(".time_wrapper .percent svg circle:nth-child(2)");
  path.style.setProperty("--time-estimate", Math.round(count * 0.5));
  document.querySelector(".minutes").textContent = Math.round(count * 0.5);
}
