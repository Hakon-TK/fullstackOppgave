export async function fetchAddOns(addonList, addonsSelect) {
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

  // Indicate completion
  return addons;
}
