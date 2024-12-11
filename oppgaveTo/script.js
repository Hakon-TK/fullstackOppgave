const drinkList = document.getElementById("drink-list");
const addonList = document.getElementById("addon-list");
const drinkSelect = document.getElementById("drink");
const addonsSelect = document.getElementById("addons");
const orderSummaryBody = document.getElementById("order-summary-body");

// Fetch Drinks
async function fetchDrinks() {
  const response = await fetch("backend.php?action=getDrinks");
  const drinks = await response.json();

  drinks.forEach((drink) => {
    const li = document.createElement("li");
    li.textContent = `${drink.name} - ${drink.price} NOK`;
    drinkList.appendChild(li);

    const option = document.createElement("option");
    option.value = JSON.stringify({ id: drink.id, price: drink.price });
    option.textContent = `${drink.name} - ${drink.price} NOK`;
    drinkSelect.appendChild(option);
  });
}

// Fetch AddOns
async function fetchAddOns() {
  const response = await fetch("backend.php?action=getAddOns");
  const addons = await response.json();

  addons.forEach((addon) => {
    const li = document.createElement("li");
    li.textContent = `${addon.name} - ${addon.price} NOK`;
    addonList.appendChild(li);

    const option = document.createElement("option");
    option.value = JSON.stringify({ id: addon.id, price: addon.price });
    option.textContent = `${addon.name} - ${addon.price} NOK`;
    addonsSelect.appendChild(option);
  });
}

// Submit Order
document.getElementById("order-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const selectedDrink = JSON.parse(drinkSelect.value);
  const drinkId = selectedDrink.id;
  const drinkPrice = parseFloat(selectedDrink.price);

  const selectedAddons = Array.from(addonsSelect.selectedOptions).map((opt) =>
    JSON.parse(opt.value)
  );
  const addonIds = selectedAddons.map((addon) => addon.id);
  const addonsPrice = selectedAddons.reduce(
    (total, addon) => total + parseFloat(addon.price),
    0
  );

  const totalPrice = drinkPrice + addonsPrice;

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

  // Refresh orders
  fetchOrders();
});

// Delete Order
async function deleteOrder(orderId) {
  const response = await fetch("backend.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `action=deleteOrder&id=${orderId}`,
  });

  const result = await response.text();
  alert(result);

  // Refresh orders
  fetchOrders();
}

// Fetch Orders
async function fetchOrders() {
  const response = await fetch("backend.php?action=getOrders");
  const orders = await response.json();

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
    deleteButton.addEventListener("click", () => deleteOrder(order.id));
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    orderSummaryBody.appendChild(row);
  });
}

// Initialize
fetchDrinks();
fetchAddOns();
fetchOrders();
