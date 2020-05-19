export function card() {
  let $ = require("jquery");
  window.jQuery = $;
  let card = require("card");

  card = new Card({
    // a selector or DOM element for the form where users will
    // be entering their information
    form: "form", // *required*
    // a selector or DOM element for the container
    // where you want the card to appear
    container: "article.card_ani", // *required*

    formSelectors: {
      numberInput: "input#number", // optional — default input[name="number"]
      expiryInput: "input#month, input#year", // optional — default input[name="expiry"]
      cvcInput: "input#secure", // optional — default input[name="cvc"]
      nameInput: "input#full_name", // optional - defaults input[name="name"]
    },

    width: 200, // optional — default 350px
    formatting: true, // optional - default true

    // Strings for translation - optional
    messages: {
      validDate: "valid\ndate", // optional - default 'valid\nthru'
      monthYear: "mm/yyyy", // optional - default 'month/year'
    },

    // Default placeholders for rendered fields - optional
    /*    placeholders: {
      number: "•••• •••• •••• ••••",
      name: "Full Name",
      expiry: "••/••",
      cvc: "•••",
    }, */

    /*    masks: {
      cardNumber: "•", // optional - mask card number
    }, */

    // if true, will log helpful messages for setting up Card
    debug: false, // optional - default false
  });
  var setCardTypeOrig = Card.prototype.handlers.setCardType;

  Card.prototype.handlers.setCardType = function ($el, e) {
    var allowedCards = ["mastercard", "visa", "dankort", "discover", "jcb", "visaelectron", "elo"];
    if (allowedCards.indexOf(e.data) < 0) e.data = "unknown";
    setCardTypeOrig.call(this, $el, e);
  };
}
