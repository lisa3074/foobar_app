const restDb = "https://frontend-22d4.restdb.io/rest/foobar";

export function checkIfValid() {
  console.log("checkValidity");
  const user = getUser();
  //Check validity
  //if valid
  loginDelegation(user);
  displayAccount(user);
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
  document.querySelector(".account_container .grid_item2").addEventListener("click", setReceipts);
  document.querySelector(".check_status .check").addEventListener("click", getStatus);
}
function displayAccount(user) {
  console.log("displayAccount");
  document.querySelector(".log_in_container").classList.add("hide");
  document.querySelector(".account_container").classList.remove("hide");
  document.querySelector(".receipts_container").classList.add("hide");
  document.querySelector(".main_content .login_heading").textContent = "ACCOUNT";
}

function setReceipts(user) {
  console.log("setReceipts");
  displayReceipts();
}
function logout() {
  console.log("logout");
  document.querySelector(".log_in_container").classList.remove("hide");
  document.querySelector(".account_container").classList.add("hide");
  document.querySelector(".receipts_container").classList.add("hide");
  document.querySelector(".main_content .login_heading").textContent = "LOG IN";
}

function displayReceipts() {
  console.log("displayReceipts");
  document.querySelector(".log_in_container").classList.add("hide");
  document.querySelector(".account_container").classList.add("hide");
  document.querySelector(".receipts_container").classList.remove("hide");
  document.querySelector(".main_content .login_heading").textContent = "RECEIPTS";
  document.querySelector(".close_receipts").addEventListener("click", function () {
    displayAccount();
  });
}
function getStatus() {
  console.log("getStatus");
  //gem resultatet in en const status
  displayStatus(status);
}
function displayStatus(status) {
  console.log("displayStatus");
}
