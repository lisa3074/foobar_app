const HTML = {};

export function dashWinDelegation() {
  HTML.winUrl = "https://frontend-22d4.restdb.io/rest/winner";
  HTML.apiKey = "5e9581a6436377171a0c234f";
  HTML.theWinner;
  getData();
}
async function getData() {
  console.log("getData");

  let response = await fetch(`${HTML.winUrl}/${"5ece601e2313157900020042"}`, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "x-apikey": HTML.apiKey,
      "cache-control": "no-cache",
    },
  });
  let jsonData = await response.json();
  HTML.theWinner = jsonData.winner_number;
  displayData();
}
function displayData() {
  console.log("displayData");
  document.querySelector(".last_win").textContent = HTML.theWinner;
  setTimeout(() => {
    getData();
  }, 1000);
}
