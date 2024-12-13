export function addRow(dataTable, data, isNew = false) {
  // Legger til en ny rad i tabellen, enten øverst eller nederst avhengig av isNew
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

export async function fetchData(dataTable, addRowCallback) {
  try {
    const response = await fetch("backend.php");
    if (!response.ok) {
      throw new Error("Server error: " + response.status);
    }

    const result = await response.json();
    if (result.success) {
      // Legger til den nyeste posten øverst hvis tilgjengelig
      if (result.latest) {
        addRowCallback(dataTable, result.latest, true);
      }
      // Legger til resten av dataene i tabellen
      result.data.forEach((entry, index) => {
        if (index > 0) {
          addRowCallback(dataTable, entry);
        }
      });
    } else {
      console.error("Feil:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
