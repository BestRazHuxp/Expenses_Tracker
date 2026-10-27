async function loadCategories() {
    const response = await fetch("/api/categories");
    const categories = await response.json();

    const select = document.getElementById("category_adding");

    select.innerHTML = "";

    for (const category of categories) {
        const option = document.createElement("option");

        option.value = category.category_id;
        option.textContent = category.name;

        select.appendChild(option);
    }
}

loadCategories();