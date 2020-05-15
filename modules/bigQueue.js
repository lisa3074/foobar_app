export function loadJson() {
  console.log("loadJson");
  makeObjects();
}
function makeObjects() {
  console.log("makeObjects");
  loops();
}
function loops() {
  console.log("loops");
  displayQueue();
}
function displayQueue() {
  console.log("displayQueue");
  //der skal en setTimeOut på inden den sættes til, så det ikke looper
  //loadJson();
}
