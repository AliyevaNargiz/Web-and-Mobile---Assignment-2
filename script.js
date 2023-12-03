document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const paginationContainer = document.getElementById('pagination');
    const productInfoModal = document.getElementById('product-info-modal');
    const productInfoContent = document.getElementById('product-info-content');

    const apiUrl = 'https://dummyjson.com/products';

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            return data.products;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <p>${product.title}</p>
                <p>Price: $${product.price}</p>
                <p>Discount: ${product.discount}%</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
            `;
            productDiv.addEventListener('click', () => displayProductInfo(product));
            productsContainer.appendChild(productDiv);
        });
    }

    function populateCategories(products) {
        const categories = [...new Set(products.map(product => product.category))];
        const optionList = categories.map(category => `<option value="${category}">${category}</option>`).join('');
        categorySelect.innerHTML = `<option value="">All Categories</option>${optionList}`;
    }

    function displayProductInfo(product) {
        productInfoContent.innerHTML = `
            <h2>${product.title}</h2>
            <p>Price: $${product.price}</p>
            <p>Discount: ${product.discount}%</p>
            <p>Category: ${product.category}</p>
            <p>Stock: ${product.stock}</p>
            <!-- Add additional information as needed -->
        `;
        productInfoModal.style.display = 'flex';
    }

    function filterProducts() {
        const keyword = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();

        const filteredProducts = products.filter(product =>
            (product.title.toLowerCase().includes(keyword) ||
             product.category.toLowerCase().includes(keyword)) &&
            (selectedCategory === '' || product.category.toLowerCase() === selectedCategory)
        );

        displayProducts(filteredProducts);
    }

    function closeProductInfoModal() {
        productInfoModal.style.display = 'none';
    }

    fetchData().then(products => {
        populateCategories(products);
        displayProducts(products);
        filterProducts(); // Filter on initial load
        // handlePagination(products);
    });

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    productInfoModal.addEventListener('click', closeProductInfoModal);
    productInfoContent.addEventListener('click', event => event.stopPropagation());
});
