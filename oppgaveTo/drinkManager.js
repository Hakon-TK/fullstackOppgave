export async function fetchDrinks(drinkList, drinkSelect) {
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

  // Indicate completion
  return drinks;
}
