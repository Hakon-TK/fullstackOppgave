export async function submitOrder(
  form,
  drinkSelect,
  addonsSelect,
  fetchOrders
) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Henter valgt drikk og beregner prisen
    const selectedDrink = JSON.parse(drinkSelect.value);
    const drinkId = selectedDrink.id;
    const drinkPrice = parseFloat(selectedDrink.price);

    // Henter valgte tillegg og beregner totalprisen
    const selectedAddons = Array.from(addonsSelect.selectedOptions).map((opt) =>
      JSON.parse(opt.value)
    );
    const addonIds = selectedAddons.map((addon) => addon.id);
    const addonsPrice = selectedAddons.reduce(
      (total, addon) => total + parseFloat(addon.price),
      0
    );

    const totalPrice = drinkPrice + addonsPrice;

    // Sender bestillingen til backend
    const response = await fetch("backend.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `action=createOrder&details=${JSON.stringify({
        drinkId,
        addonIds,
      })}&totalPrice=${totalPrice}`,
    });

    const result = await response.text();
    alert(result);

    // Oppdaterer bestillingsoversikten
    fetchOrders();
  });
}

export async function fetchOrders(orderSummaryBody, drinkSelect, addonsSelect) {
  const response = await fetch("backend.php?action=getOrders");
  const orders = await response.json();

  // Fjerner eksisterende rader før oppdatering
  while (orderSummaryBody.firstChild) {
    orderSummaryBody.removeChild(orderSummaryBody.firstChild);
  }

  orders.forEach((order) => {
    const row = document.createElement("tr");

    const detailsCell = document.createElement("td");
    const orderDetails = JSON.parse(order.details);
    const drinkOption = Array.from(drinkSelect.options).find(
      (opt) => JSON.parse(opt.value).id == orderDetails.drinkId
    );
    const drinkName = drinkOption
      ? drinkOption.text.split(" - ")[0]
      : "Unknown Drink";

    const addonNames = orderDetails.addonIds
      .map((id) => {
        const addonOption = Array.from(addonsSelect.options).find(
          (opt) => JSON.parse(opt.value).id == id
        );
        return addonOption
          ? addonOption.text.split(" - ")[0]
          : "Unknown Add-On";
      })
      .join(", ");

    detailsCell.textContent = `${drinkName} (${addonNames})`;
    row.appendChild(detailsCell);

    const priceCell = document.createElement("td");
    priceCell.textContent = `${order.totalPrice || "N/A"} NOK`;
    row.appendChild(priceCell);

    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Slett";
    deleteButton.addEventListener("click", () =>
      deleteOrder(order.id, () =>
        fetchOrders(orderSummaryBody, drinkSelect, addonsSelect)
      )
    );
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    orderSummaryBody.appendChild(row);
  });
}

export async function deleteOrder(orderId, fetchOrders) {
  // Sletter bestillingen fra backend
  const response = await fetch("backend.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=deleteOrder&id=${orderId}`,
  });

  const result = await response.text();
  alert(result);

  // Oppdaterer bestillingsoversikten etter sletting
  fetchOrders();
}
