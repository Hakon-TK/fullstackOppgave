// app.js
const form = document.getElementById("registrationForm");
const dataTable = document
  .getElementById("dataTable")
  .getElementsByTagName("tbody")[0];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const jsonData = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("backend.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const result = await response.json();

    if (result.success) {
      addRow(result.data, true);
    } else {
      alert("Feil: " + result.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("En feil oppstod. Prøv igjen senere.");
  }
});

function addRow(data, isNew = false) {
  const newRow = isNew ? dataTable.insertRow(0) : dataTable.insertRow();

  const firstNameCell = newRow.insertCell(0);
  const lastNameCell = newRow.insertCell(1);
  const emailCell = newRow.insertCell(2);
  const phoneCell = newRow.insertCell(3);
  const birthDateCell = newRow.insertCell(4);

  firstNameCell.textContent = data.firstName;
  lastNameCell.textContent = data.lastName;
  emailCell.textContent = data.email || "Ingen";
  phoneCell.textContent = data.phone;
  birthDateCell.textContent = data.birthDate;
}

// Initial fetch to populate table
async function fetchData() {
  try {
    const response = await fetch("backend.php");
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const result = await response.json();
    if (result.success) {
      if (result.latest) {
        addRow(result.latest, true);
      }
      result.data.forEach((entry, index) => {
        if (index > 0) {
          addRow(entry);
        }
      });
    } else {
      console.error("Feil:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();
