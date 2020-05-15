export function loadJson() {
  console.log("loadJson");
  makeObjects();
}
function makeObjects() {
  console.log("makeObjects");
  //if still in queue
  queueLoops();
  //is served
  serveLoop();
}
function queueLoops() {
  console.log("queueLoops");
  displayQueue();
}
function serveLoop() {
  console.log("serveLoop");
  displayServed();
}
function displayQueue() {
  console.log("displayQueue");
  //der skal en setTimeOut på inden den sættes til, så det ikke looper
  //loadJson();
}
function displayServed() {
  console.log("displayServed");
  //der skal en setTimeOut på inden den sættes til, så det ikke looper
  //loadJson();
}
