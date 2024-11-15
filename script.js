// URL of the API Gateway
const apiUrl = 'https://a7sbmy9w6k.execute-api.us-east-1.amazonaws.com/prod/products';

// Store the selected product in a global variable for editing
let selectedProduct = null;

// Load products when viewing the product list page
async function loadProductList() {
    const storeList = document.getElementById('storeList').getElementsByTagName('tbody')[0];
    storeList.innerHTML = ''; // Clear the table before adding new rows

    try {
        const response = await fetch(apiUrl);
        const products = await response.json();

        products.forEach(product => {
            const row = storeList.insertRow();
            row.insertCell(0).innerText = product.productCode;
            row.insertCell(1).innerText = product.productName;
            row.insertCell(2).innerText = product.qty;
            row.insertCell(3).innerText = product.price;

            // Add delete button
            const deleteCell = row.insertCell(4);
            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.onclick = () => deleteProduct(product.productCode);
            deleteCell.appendChild(deleteButton);

            // Add edit button
            const editCell = row.insertCell(5);
            const editButton = document.createElement('button');
            editButton.innerText = 'Edit';
            editButton.onclick = () => editProduct(product);
            editCell.appendChild(editButton);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to submit the form
async function onFormSubmit(event) {
    event.preventDefault();

    const formData = readFormData();
    if (selectedProduct == null) {
        await addProduct(formData); // Add new product if no product is selected
    } else {
        await updateProduct(formData); // Update product if a product is selected
        selectedProduct = null; // Reset selected product after updating
    }
    resetForm(); // Clear the form after submission
    window.location.href = 'product_list.html'; // Go back to the product list page
}

// Function to add a new product
async function addProduct(product) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        const result = await response.json();
        alert(result.message || 'Product added successfully');
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Function to update an existing product
async function updateProduct(product) {
    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        const result = await response.json();
        alert(result.message || 'Product updated successfully');
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

// Function to delete a product
async function deleteProduct(productCode) {
    if (confirm('Do you want to delete this product?')) {
        try {
            const response = await fetch(`${apiUrl}/${productCode}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            alert(result.message || 'Product deleted successfully');
            await loadProductList(); // Refresh product list after deletion
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

// Function to edit a product
function editProduct(product) {
    // Store product data in localStorage to be accessed in add_product.html
    localStorage.setItem('editProduct', JSON.stringify(product));
    window.location.href = 'add_product.html'; // Redirect to the add product form
}

// Load product data if available in add_product.html for editing
window.onload = function() {
    const currentPath = window.location.pathname;
    if (currentPath.endsWith('add_product.html')) {
        const product = JSON.parse(localStorage.getItem('editProduct'));
        if (product) {
            document.getElementById('productCode').value = product.productCode;
            document.getElementById('productName').value = product.productName;
            document.getElementById('qty').value = product.qty;
            document.getElementById('price').value = product.price;
            selectedProduct = product; // Set selectedProduct for updating
            localStorage.removeItem('editProduct'); // Clear localStorage after loading
        }
    } else if (currentPath.endsWith('product_list.html')) {
        loadProductList(); // Load product list if on the product list page
    }
};

// Function to read form data
function readFormData() {
    return {
        productCode: document.getElementById('productCode').value,
        productName: document.getElementById('productName').value,
        qty: document.getElementById('qty').value,
        price: document.getElementById('price').value
    };
}

// Function to reset the form
function resetForm() {
    document.getElementById('productCode').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('qty').value = '';
    document.getElementById('price').value = '';
    selectedProduct = null;
}
