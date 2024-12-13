import { handleFormSubmit } from "./formHandler.js";
import { addRow, fetchData } from "./tableManager.js";

const body = document.body;
const nightModeToggleImage = document.querySelector("#nightModeToggleImage");
const form = document.querySelector("#registrationForm");
const table = document.querySelector("#dataTable");
let nightMode = false;

// Night mode toggle functionality
nightModeToggleImage.addEventListener("click", () => {
  if (nightMode === false) {
    body.style.backgroundColor = "#262626";
    body.style.color = "#f4f4f9";
    form.style.backgroundColor = "#6f6f6f";
    form.style.borderColor = "#6f6f6f";
    form.style.boxShadow = "0 0 4px #6f6f6f";
    table.style.color = "#333";

    // Change border color for all cells
    document
      .querySelectorAll("#dataTable td, #dataTable th")
      .forEach((cell) => {
        cell.style.border = "1px solid #262626";
      });

    // Swap to dark mode image
    nightModeToggleImage.src = "./images/darkmode.png";

    nightMode = true;
  } else {
    body.style.backgroundColor = "#f4f4f9";
    body.style.color = "#333";
    form.style.backgroundColor = "white";
    form.style.borderColor = "#ddd";
    form.style.boxShadow = "0 0 4px rgba(0, 0, 0, 0.1)";

    // Reset border color for all cells
    document
      .querySelectorAll("#dataTable td, #dataTable th")
      .forEach((cell) => {
        cell.style.border = "1px solid #ddd"; // Default border color
      });

    // Swap to light mode image
    nightModeToggleImage.src = "./images/lightmode.png";

    nightMode = false;
  }
});

const dataTable = document
  .getElementById("dataTable")
  .getElementsByTagName("tbody")[0];

// Koble skjema til håndteringsfunksjon
handleFormSubmit(form, (data, isNew) => addRow(dataTable, data, isNew));

// Initial henting av data og oppdatering av tabell
fetchData(dataTable, addRow);
