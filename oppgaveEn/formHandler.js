export function handleFormSubmit(form, submitCallback) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Samler og konverterer skjemadata til JSON-format
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

      // Kaller tilbakefunksjonen hvis innsendingen lykkes
      if (result.success) {
        submitCallback(result.data, true);
      } else {
        alert("Feil: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("En feil oppstod. Prøv igjen senere.");
    }
  });
}
