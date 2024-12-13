import { fetchDrinks } from "./drinkManager.js";
import { fetchAddOns } from "./addonManager.js";
import { submitOrder, fetchOrders, deleteOrder } from "./orderManager.js";

const body = document.body;
const drinkList = document.querySelector("#drink-list");
const addonList = document.querySelector("#addon-list");
const drinkSelect = document.querySelector("#drink");
const addonsSelect = document.querySelector("#addons");
const orderSummaryBody = document.querySelector("#order-summary-body");
const orderForm = document.querySelector("#order-form");
const nightModeToggleImage = document.querySelector("#nightModeToggleImage");
const container = document.querySelector("#container");
let nightMode = false;

// Night mode toggle functionality
nightModeToggleImage.addEventListener("click", () => {
  if (nightMode === false) {
    body.style.backgroundColor = "#262626";
    body.style.color = "#f4f4f9";
    container.style.backgroundColor = "#6f6f6f";
    container.style.borderColor = "#6f6f6f";
    container.style.boxShadow = "0 0 4px #6f6f6f";

    // Change border color for all cells
    document
      .querySelectorAll("#order-summary td, #order-summary th")
      .forEach((cell) => {
        cell.style.border = "1px solid #6f6f6f";
      });

    // Change border color for all cells
    document
      .querySelectorAll("#order-summary-body td, #order-summary-body th")
      .forEach((cell) => {
        cell.style.border = "1px solid white";
      });

    // Swap to dark mode image
    nightModeToggleImage.src = "./images/darkmode.png";

    nightMode = true;
  } else {
    body.style.backgroundColor = "#f4f4f9";
    body.style.color = "black";
    container.style.backgroundColor = "white";
    container.style.borderColor = "#ddd";
    container.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.1)";

    // Reset border color for all cells
    document
      .querySelectorAll("#order-summary td, #order-summary th")
      .forEach((cell) => {
        cell.style.border = "1px solid #ddd"; // Default border color
      });

    // Swap to light mode image
    nightModeToggleImage.src = "./images/lightmode.png";

    nightMode = false;
  }
});

// Initialiserer appen ved å hente drikker, tillegg og eksisterende bestillinger
Promise.all([
  fetchDrinks(drinkList, drinkSelect),
  fetchAddOns(addonList, addonsSelect),
]).then(() => {
  // Fetch orders only after drinks and add-ons are loaded
  fetchOrders(orderSummaryBody, drinkSelect, addonsSelect);
});

// Knytter skjemaet til funksjonalitet for å sende inn bestillinger
submitOrder(orderForm, drinkSelect, addonsSelect, () =>
  fetchOrders(orderSummaryBody, drinkSelect, addonsSelect)
);
