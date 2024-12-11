document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm");

  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(this);

    fetch("server.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          updateTable(data.records);
          alert("Dataen er lagret!");
        } else {
          alert("Feil: " + data.error);
        }
      })
      .catch((error) => console.error("Error: ", error));
  });

  function updateTable(records) {
    const tableBody = document.querySelector("#resultsTable tbody");
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    records.forEach((record) => {
      const row = document.createElement("tr");

      const firstNameCell = document.createElement("td");
      firstNameCell.textContent = record.firstNameCell;
      row.appendChild(fornavnCell);

      const lastNameCell = document.createElement("td");
      lastNameCell.textContent = record.lastNameCell;
      row.appendChild(lastNameCell);

      const emailCell = document.createElement("td");
      emailCell.textContent = record.emailCell;
      row.appendChild(emailCell);

      const phoneCell = document.createElement("td");
      phoneCell.textContent = record.phoneCell;
      row.appendChild(phoneCell);

      const birthdayCell = document.createElement("td");
      birthdayCell.textContent = record.birthdayCell;
      row.appendChild(birthdayCell);

      tableBody.appendChild(row);
    });
  }
});
