export function checkValidity() {
  console.log("checkValidity");
  const user = getUser();
  //Check validity
  //if valid
  loginDelegation(user);
  //else
  displayError();
}
function getUser() {
  console.log("getUser");
  //GET
  return;
}
function displayError() {
  console.log("displayError");
}
function loginDelegation(user) {
  console.log("loginDelegation");
  displayAccount(user);
  setReceipts(user);
  document.querySelector(".account_container .grid_item3").addEventListener("click", logout);
  document.querySelector(".account_container .grid_item2").addEventListener("click", displayReceipts);
  document.querySelector(".check_status .check").addEventListener("click", getStatus);
}
function displayAccount(user) {
  console.log("displayAccount");
}

function setReceipts(user) {
  console.log("setReceipts");
}
function logout() {
  console.log("logout");
}

function displayReceipts() {
  console.log("displayReceipts");
}
function getStatus() {
  console.log("getStatus");
  //gem resultatet in en const status
  displayStatus(status);
}
function displayStatus(status) {
  console.log("displayStatus");
}
