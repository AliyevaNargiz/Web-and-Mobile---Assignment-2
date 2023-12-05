// Event Listener Setup
document.addEventListener('DOMContentLoaded', () => {     
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const paginationContainer = document.getElementById('pagination');
    const productInfoModal = document.getElementById('product-info-modal');
    const productInfoContent = document.getElementById('product-info-content');
    //Event Listeners for Search and Category
    searchInput.addEventListener('input', filterAndPaginate);
    categorySelect.addEventListener('change', filterAndPaginate);




    //Variable Declarations
    const apiUrl = 'https://dummyjson.com/products?limit=100';
    const productsPerPage = 10;
    let currentPage = 1;
    let products = [];



    //Fetch Data
async function fetchData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Fetched Data:', data);
        products = data.products;
        return data.products;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}



      //Fetch Data and Initialization
    fetchData().then(products => {
        console.log(products);
        populateCategories(products);
        filterAndPaginate();
        displayProducts(products);
        filterProducts(); 
    });
  

    //Display Products Page
    function displayProductsPage(products) {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = products.slice(startIndex, endIndex);
        displayProducts(productsToShow);
    }



        //Display Products
    function displayProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                <p>${product.title}</p>
                <p>Price: ${product.price}</p>
                <p>Discount: ${product.discountPercentage}%</p>
                <p>Category: ${product.category}</p>
                <p>Stock: ${product.stock}</p>
            `;
            productDiv.addEventListener('click', () => displayProductInfo(product));
            productsContainer.appendChild(productDiv);
        });
    }


//Display Product Info
function displayProductInfo(product) {
    productInfoContent.innerHTML = `
        <div class="product-info">
            <div class="product-details">
                <h2>${product.title}</h2>
                <p>Price: $${product.price}</p>
                <p>Discount: ${product.discountPercentage}%</p>
                <p>Category: ${product.category}</p>
                <p>Brand: ${product.brand}</p>
                <p>Rating: ${product.rating}</p>
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


    
    

    



// Open Full Size Image
function openFullSizeImage(imageUrl) {
    window.open(imageUrl, '_blank');
}

    
    

//Search and Category Filter
    function filterAndPaginate() {
        filterProducts();
        updatePagination(products);
        displayProductsPage(products);
    }




 //Populate Categories
    function populateCategories(products) {
        const categories = [...new Set(products.map(product => product.category))];
        const optionList = categories.map(category => `<option value="${category}">${category}</option>`).join('');
        categorySelect.innerHTML = `<option value="">All Categories</option>${optionList}`;
    }



//Filter Products
function filterProducts() {
    const keyword = searchInput.value.toLowerCase().trim();
    const selectedCategory = categorySelect.value.toLowerCase().trim();

    const filteredProducts = products.filter(product =>
        (keyword === '' || product.title.toLowerCase().includes(keyword) || product.category.toLowerCase().includes(keyword)) &&
        (selectedCategory === '' || product.category.toLowerCase() === selectedCategory)
    );

    currentPage = 1; // Reset to the first page when applying new filters
    displayProductsPage(filteredProducts);
    updatePagination(filteredProducts);
}
    
    //Close Product Info Modal
    function closeProductInfoModal() {
        productInfoModal.style.display = 'none';
    }





    //Update Pagination
function updatePagination(products) {
    const totalPages = Math.ceil(products.length / productsPerPage);

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === currentPage;
        paginationHTML += `<button class="${isActive ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;

    const paginationButtons = paginationContainer.querySelectorAll('button');
    paginationButtons.forEach((button) => {
        button.addEventListener('click', () => {
            currentPage = parseInt(button.getAttribute('data-page'));
            displayProductsPage(products);
            updatePagination(products); // Update pagination to highlight the active page
        });
    });
}



    
searchInput.addEventListener('input', () => {
    filterProducts();
});

categorySelect.addEventListener('change', () => {
    filterProducts();
});
    
    
    
    
//Additional Event Listeners
    searchInput.addEventListener('input', filterAndPaginate);
    categorySelect.addEventListener('change', filterAndPaginate);
    productInfoContent.addEventListener('click', event => event.stopPropagation());
});
