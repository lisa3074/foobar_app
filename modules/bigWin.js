const winUrl = "https://frontend-22d4.restdb.io/rest/winner";
const apiKey = "5e9581a6436377171a0c234f";
let theWinner;
export async function getData() {
  console.log("getData");

  let response = await fetch(`${winUrl}/${"5ece601e2313157900020042"}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": apiKey,
      "cache-control": "no-cache",
    },
  });
  let jsonData = await response.json();
  theWinner = jsonData.winner_number;
  displayData();
}
function displayData() {
  console.log("displayData");
  document.querySelector(".last_win").textContent = theWinner;
  //vis info numre
  setTimeout(() => {
    getData();
  }, 1000);
}
