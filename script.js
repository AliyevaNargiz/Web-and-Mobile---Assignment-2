document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const paginationContainer = document.getElementById('pagination');
    const productInfoModal = document.getElementById('product-info-modal');
    const productInfoContent = document.getElementById('product-info-content');

    let products = [];

    const apiUrl = 'https://dummyjson.com/products';

    async function fetchData() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            products = data.products;
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
                <p>Discount: ${product.discountPercentage}%</p>
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
        <div class="product-info">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p>Price: $${product.price}</p>
                <p>Discount: ${product.discountPercentage}%</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
                <h3>Description:</h3>
                <p>${product.description}</p>
            </div>
            <div id="gallery" class="gallery"></div>
        </div>
        <button id="close-modal" class="close-button">Close</button>
    `;

    const galleryContainer = document.getElementById('gallery');
    product.images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image;
        imgElement.alt = `${product.title} - Image ${index + 1}`;
        imgElement.className = 'gallery-image';
        imgElement.addEventListener('click', () => openFullSizeImage(image));
        galleryContainer.appendChild(imgElement);
    });

    productInfoModal.style.display = 'flex';

    // Add a click event listener to the close button inside the modal
    document.getElementById('close-modal').addEventListener('click', closeProductInfoModal);
}



// Function to open the image in full size (replace with your implementation)
function openFullSizeImage(imageUrl) {
    // Implement your logic to display the image in full size
    // For simplicity, you can open the image in a new tab/window.
    window.open(imageUrl, '_blank');
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
        console.log(products);
        populateCategories(products);
        displayProducts(products);
        filterProducts(); // Filter on initial load
        // handlePagination(products);
    });

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    productInfoContent.addEventListener('click', event => event.stopPropagation());
});
