document.addEventListener('DOMContentLoaded', function() {
    // Simulate loading time (1 second)
    setTimeout(function() {
        document.querySelector('.loading-container').style.display = 'none';
        document.querySelector('.content').style.display = 'block';
        // Show the first section (New Product) by default
        showSection('new-product');
    }, 1000);

    // Add click handler to report menu item
    document.querySelector('a[onclick="showSection(\'report\')"]')?.addEventListener('click', function() {
        console.log('Report menu clicked');
    });

    // Add cost calculation event listeners for the new product form.
    const unitAmountInput = document.getElementById('unit_amount');
    const factorInput = document.getElementById('factor');
    const costOmrInput = document.getElementById('cost_omr');
    
    function calculateCostOMR() {
        const unit = parseFloat(unitAmountInput.value) || 0;
        const factor = parseFloat(factorInput.value) || 0;
        const cost = unit * factor;
        costOmrInput.value = cost.toFixed(3);
        
        // Calculate Sale Price as Cost Price + 35% markup (i.e., cost * 1.35)
        const salePriceInput = document.getElementById('sale_omr');
        if (salePriceInput) {
            const salePrice = cost * 1.35;
            salePriceInput.value = salePrice.toFixed(3);
        }
    }
    
    if (unitAmountInput && factorInput && costOmrInput) {
        unitAmountInput.addEventListener('input', calculateCostOMR);
        factorInput.addEventListener('input', calculateCostOMR);
    }
});

function showSection(sectionId) {
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        
        // Special handling for report section
        if (sectionId === 'report') {
            // Make sure all report components are visible
            const reportContent = document.getElementById('report-content');
            const reportSummary = document.querySelector('.report-summary');
            const reportDetails = document.querySelector('.report-details');
            
            if (reportContent) reportContent.style.display = 'block';
            if (reportSummary) reportSummary.style.display = 'grid';
            if (reportDetails) reportDetails.style.display = 'block';
            
            // Set default dates
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            const startDateInput = document.getElementById('report-start-date');
            const endDateInput = document.getElementById('report-end-date');
            
            if (startDateInput && endDateInput) {
                startDateInput.value = firstDay.toISOString().split('T')[0];
                endDateInput.value = lastDay.toISOString().split('T')[0];
            }
            
            // Generate initial report
            generateReport();
        }
    }
}

// Add this CSS to ensure report elements are visible
const reportStyles = document.createElement('style');
reportStyles.textContent = `
    #report.section {
        display: none;
    }
    
    #report.section[style*="display: block"] {
        display: block !important;
    }
    
    #report.section[style*="display: block"] #report-content {
        display: block !important;
    }
    
    #report.section[style*="display: block"] .report-summary {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
    }
    
    #report.section[style*="display: block"] .report-details {
        display: block !important;
        margin-top: 20px;
    }
    
    #report.section[style*="display: block"] .report-controls {
        display: flex !important;
        margin-bottom: 20px;
    }
`;
document.head.appendChild(reportStyles);

// Remove any existing style element that might conflict
document.querySelectorAll('style').forEach(style => {
    if (style.textContent.includes('#report-content')) {
        style.remove();
    }
});

// Add this at the top of the file, after the DOMContentLoaded event
let addedItems = [];  // Array to store added items
let purchaseHistory = [];  // Array to store purchases
let salesHistory = [];  // Array to store sales
let stockItems = [];  // Array to store stock data

// Update the product form submission handler
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the image preview HTML
    const imagePreviewHTML = document.getElementById('image-preview').innerHTML;
    
    // Collect all form data
    const newItem = {
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        size: document.getElementById('size').value,
        bodyColor: document.getElementById('body_color').value,
        watt: document.getElementById('watt').value,
        lumens: document.getElementById('lumens').value,
        cct: document.getElementById('cct').value,
        beamAngle: document.getElementById('beam_angle').value,
        inputPower: document.getElementById('input_power').value,
        driver: document.getElementById('driver').value,
        unitAmount: document.getElementById('unit_amount').value,
        factor: document.getElementById('factor').value,
        costOMR: document.getElementById('cost_omr').value,
        saleOMR: document.getElementById('sale_omr').value,
        description: document.getElementById('description').value,
        imagePreview: imagePreviewHTML  // Store the image preview HTML
    };
    
    // Add to items array
    addedItems.push(newItem);
    
    // Show the items list section first
    const itemList = document.getElementById('item-list');
    itemList.style.display = 'block';
    
    // Update the table
    updateItemsTable();
    
    // Clear the form
    this.reset();
    
    // Clear image preview
    document.getElementById('image-preview').innerHTML = '';
    
    // Show success message
    alert('Product added successfully!');
    
    // After adding new item, update all dropdowns
    updateAllDropdowns();
    updateStock();
    updateCatalog();
});

// Update the purchase model selection handler
document.getElementById('purchase_model')?.addEventListener('change', function() {
    const selectedId = this.value;
    if (!selectedId) {
        clearPurchaseForm();
        return;
    }

    const product = addedItems[parseInt(selectedId)];
    if (product) {
        // Fill in the form fields
        document.getElementById('purchase_make').value = product.make;
        
        // Update image preview with stored HTML
        const imagePreview = document.getElementById('purchase_image_preview');
        if (product.imagePreview) {
            imagePreview.innerHTML = product.imagePreview;
        } else {
            imagePreview.innerHTML = '<div class="no-image">No image available</div>';
        }

        // Set default price from product data with 3 decimal places
        document.getElementById('purchase_price').value = parseFloat(product.costOMR).toFixed(3);
    }
});

// Update the sale model selection handler
document.getElementById('sale_model')?.addEventListener('change', function() {
    const selectedId = this.value;
    if (!selectedId) {
        clearSaleForm();
        return;
    }

    const product = addedItems[parseInt(selectedId)];
    if (product) {
        // Fill in the form fields
        document.getElementById('sale_make').value = product.make;
        
        // Update image preview
        const imagePreview = document.getElementById('sale_image_preview');
        if (product.imagePreview) {
            imagePreview.innerHTML = product.imagePreview;
        } else {
            imagePreview.innerHTML = '<div class="no-image">No image available</div>';
        }

        // Set default price from product data with 3 decimal places
        document.getElementById('sale_price').value = parseFloat(product.saleOMR).toFixed(3);
    }
});

// Update the purchase form submission handler
document.getElementById('purchase-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedProduct = addedItems[parseInt(document.getElementById('purchase_model').value)];
    
    const newPurchase = {
        date: document.getElementById('purchase_date').value,
        make: document.getElementById('purchase_make').value,
        model: selectedProduct.model,
        quantity: parseInt(document.getElementById('purchase_quantity').value),
        price: parseFloat(document.getElementById('purchase_price').value).toFixed(3),
        total: (parseFloat(document.getElementById('purchase_price').value) * 
                parseInt(document.getElementById('purchase_quantity').value)).toFixed(3)
    };
    
    // Add to purchase history
    purchaseHistory.push(newPurchase);
    
    // Update the purchases table
    updatePurchasesTable();
    
    // Clear the form
    this.reset();
    
    // Show success message
    alert('Purchase recorded successfully!');
    updateStock();
});

// Update the sale form submission handler
document.getElementById('sale-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedProduct = addedItems[parseInt(document.getElementById('sale_model').value)];
    
    const newSale = {
        date: document.getElementById('sale_date').value,
        make: document.getElementById('sale_make').value,
        model: selectedProduct.model,
        quantity: parseInt(document.getElementById('sale_quantity').value),
        price: parseFloat(document.getElementById('sale_price').value).toFixed(3),
        total: (parseFloat(document.getElementById('sale_price').value) * 
                parseInt(document.getElementById('sale_quantity').value)).toFixed(3)
    };
    
    // Add to sales history
    salesHistory.push(newSale);
    
    // Update the sales table
    updateSalesTable();
    
    // Clear the form
    this.reset();
    
    // Show success message
    alert('Sale recorded successfully!');
    updateStock();
});

function generateReport() {
    console.log('Generating report...'); // Debug log
    
    const reportContent = document.getElementById('report-content');
    const reportTable = document.getElementById('report-table');
    const reportType = document.getElementById('report-type')?.value || 'summary';
    
    if (!reportContent || !reportTable) {
        console.error('Required report elements not found');
        return;
    }
    
    // Make sure report content is visible
    reportContent.style.display = 'block';
    
    // Get date range
    const startDate = document.getElementById('report-start-date')?.value;
    const endDate = document.getElementById('report-end-date')?.value;
    
    // Calculate totals
    const totalSales = salesHistory.reduce((sum, sale) => sum + parseFloat(sale.total || 0), 0);
    const totalPurchases = purchaseHistory.reduce((sum, purchase) => sum + parseFloat(purchase.total || 0), 0);
    const stockValue = stockItems.reduce((sum, item) => sum + parseFloat(item.saleValue || 0), 0);
    const profit = totalSales - totalPurchases;
    const profitPercentage = totalPurchases ? (profit / totalPurchases * 100) : 0;

    // Update summary cards
    const elements = {
        'total-sales': totalSales.toFixed(3) + ' OMR',
        'sales-count': salesHistory.length + ' transactions',
        'total-purchases': totalPurchases.toFixed(3) + ' OMR',
        'purchase-count': purchaseHistory.length + ' transactions',
        'stock-value': stockValue.toFixed(3) + ' OMR',
        'stock-count': stockItems.length + ' items',
        'profit-loss': profit.toFixed(3) + ' OMR',
        'profit-percentage': profitPercentage.toFixed(1) + '%'
    };

    // Update all summary elements if they exist
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    });

    // Generate table based on report type
    let tableHTML = '';
    switch(reportType) {
        case 'sales':
            tableHTML = generateSalesReportHTML(startDate, endDate);
            break;
        case 'purchase':
            tableHTML = generatePurchaseReportHTML(startDate, endDate);
            break;
        case 'inventory':
            tableHTML = generateInventoryReportHTML();
            break;
        case 'summary':
            tableHTML = generateSummaryReportHTML(totalSales, totalPurchases, stockValue, profit, profitPercentage);
            break;
    }

    // Update table content
    reportTable.innerHTML = tableHTML;
}

function generateSalesReportHTML(startDate, endDate) {
    const filteredSales = salesHistory.filter(sale => 
        (!startDate || sale.date >= startDate) && (!endDate || sale.date <= endDate)
    );

    return `
        <thead>
            <tr>
                <th>Date</th>
                <th>Make</th>
                <th>Model</th>
                <th>Quantity</th>
                <th>Price (OMR)</th>
                <th>Total (OMR)</th>
            </tr>
        </thead>
        <tbody>
            ${filteredSales.length > 0 ? 
                filteredSales.map(sale => `
                    <tr>
                        <td>${sale.date}</td>
                        <td>${sale.make}</td>
                        <td>${sale.model}</td>
                        <td>${sale.quantity}</td>
                        <td>${sale.price}</td>
                        <td>${sale.total}</td>
                    </tr>
                `).join('') : 
                '<tr><td colspan="6" style="text-align: center;">No sales data available</td></tr>'
            }
        </tbody>
    `;
}

function generatePurchaseReportHTML(startDate, endDate) {
    const filteredPurchases = purchaseHistory.filter(purchase => 
        (!startDate || purchase.date >= startDate) && (!endDate || purchase.date <= endDate)
    );

    return `
        <thead>
            <tr>
                <th>Date</th>
                <th>Make</th>
                <th>Model</th>
                <th>Quantity</th>
                <th>Price (OMR)</th>
                <th>Total (OMR)</th>
            </tr>
        </thead>
        <tbody>
            ${filteredPurchases.length > 0 ? 
                filteredPurchases.map(purchase => `
                    <tr>
                        <td>${purchase.date}</td>
                        <td>${purchase.make}</td>
                        <td>${purchase.model}</td>
                        <td>${purchase.quantity}</td>
                        <td>${purchase.price}</td>
                        <td>${purchase.total}</td>
                    </tr>
                `).join('') : 
                '<tr><td colspan="6" style="text-align: center;">No purchase data available</td></tr>'
            }
        </tbody>
    `;
}

function generateInventoryReportHTML() {
    return `
        <thead>
            <tr>
                <th>Make</th>
                <th>Model</th>
                <th>Purchased</th>
                <th>Sold</th>
                <th>Available</th>
                <th>Value (OMR)</th>
            </tr>
        </thead>
        <tbody>
            ${stockItems.length > 0 ? 
                stockItems.map(item => `
                    <tr>
                        <td>${item.make}</td>
                        <td>${item.model}</td>
                        <td>${item.purchased}</td>
                        <td>${item.sold}</td>
                        <td>${item.available}</td>
                        <td>${item.saleValue}</td>
                    </tr>
                `).join('') : 
                '<tr><td colspan="6" style="text-align: center;">No inventory data available</td></tr>'
            }
        </tbody>
    `;
}

function generateSummaryReportHTML(totalSales, totalPurchases, stockValue, profit, profitPercentage) {
    return `
        <thead>
            <tr>
                <th>Category</th>
                <th>Total Amount (OMR)</th>
                <th>Number of Transactions</th>
                <th>Average Value (OMR)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Sales</td>
                <td>${totalSales.toFixed(3)}</td>
                <td>${salesHistory.length}</td>
                <td>${(salesHistory.length ? totalSales / salesHistory.length : 0).toFixed(3)}</td>
            </tr>
            <tr>
                <td>Purchases</td>
                <td>${totalPurchases.toFixed(3)}</td>
                <td>${purchaseHistory.length}</td>
                <td>${(purchaseHistory.length ? totalPurchases / purchaseHistory.length : 0).toFixed(3)}</td>
            </tr>
            <tr>
                <td>Current Stock</td>
                <td>${stockValue.toFixed(3)}</td>
                <td>${stockItems.length}</td>
                <td>${(stockItems.length ? stockValue / stockItems.length : 0).toFixed(3)}</td>
            </tr>
            <tr class="summary-total">
                <td><strong>Profit/Loss</strong></td>
                <td><strong>${profit.toFixed(3)}</strong></td>
                <td colspan="2"><strong>${profitPercentage.toFixed(1)}% margin</strong></td>
            </tr>
        </tbody>
    `;
}

// Mock function to load products (replace with actual API call)
function loadProducts() {
    const products = [
        { id: 1, name: 'Product 1', code: 'P001', stock: 100, price: 10.99 },
        { id: 2, name: 'Product 2', code: 'P002', stock: 150, price: 15.99 }
    ];
    
    // Populate product dropdowns and stock table
    updateProductDropdowns(products);
    updateStockTable(products);
}

function updateProductDropdowns(products) {
    const dropdowns = document.querySelectorAll('select');
    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Select Product</option>';
        products.forEach(product => {
            dropdown.innerHTML += `<option value="${product.id}">${product.name}</option>`;
        });
    });
}

function updateStockTable(products) {
    const tbody = document.querySelector('#stock-table tbody');
    tbody.innerHTML = '';
    products.forEach(product => {
        tbody.innerHTML += `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.stock}</td>
                <td>$${product.price}</td>
            </tr>
        `;
    });
}

// Load initial data
loadProducts();

document.getElementById('pictures').addEventListener('change', function(e) {
    const preview = document.getElementById('image-preview');
    preview.innerHTML = '';
    
    for (const file of this.files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                preview.appendChild(img);
            }
            reader.readAsDataURL(file);
        }
    }
});

// Add automatic calculation of OMR values
document.getElementById('unit_amount').addEventListener('input', calculateOMR);
document.getElementById('factor').addEventListener('input', calculateOMR);

function calculateOMR() {
    const unitAmount = parseFloat(document.getElementById('unit_amount').value) || 0;
    const factor = parseFloat(document.getElementById('factor').value) || 0;
    const costOMR = unitAmount * factor * 0.385; // Assuming conversion rate
    
    document.getElementById('cost_omr').value = costOMR.toFixed(3);
    // Set sale price 30% higher than cost by default
    document.getElementById('sale_omr').value = (costOMR * 1.3).toFixed(3);
}

// Mock product database (replace with actual database)
const productDatabase = [
    {
        id: 1,
        make: 'Brand A',
        model: 'MODEL-001',
        pictures: ['path/to/image1.jpg'],
        size: '30x30',
        bodyColor: 'White',
        watt: 15,
        lumens: 1500,
        cct: '3000K',
        beamAngle: '120°',
        inputPower: '220V',
        driver: 'Standard',
        unitAmount: 25.00,
        factor: 1.2,
        costOMR: 11.55,
        saleOMR: 15.02
    },
    // Add more products as needed
];

// Add this function to update both purchase and sale dropdowns
function updateAllDropdowns() {
    // Update purchase dropdown
    const purchaseSelect = document.getElementById('purchase_model');
    // Update sale dropdown
    const saleSelect = document.getElementById('sale_model');
    
    if (purchaseSelect) {
        purchaseSelect.innerHTML = '<option value="">Select Model</option>';
        addedItems.forEach((product, index) => {
            purchaseSelect.innerHTML += `<option value="${index}">${product.model}</option>`;
        });
    }
    
    if (saleSelect) {
        saleSelect.innerHTML = '<option value="">Select Model</option>';
        addedItems.forEach((product, index) => {
            saleSelect.innerHTML += `<option value="${index}">${product.model}</option>`;
        });
    }
}

// Replace the existing updateProductDropdowns function with a call to updateAllDropdowns
function updateProductDropdowns() {
    updateAllDropdowns();
}

function clearPurchaseForm() {
    document.getElementById('purchase_make').value = '';
    document.getElementById('purchase_image_preview').innerHTML = '';
    document.getElementById('purchase_price').value = '';
    document.getElementById('purchase_quantity').value = '';
    document.getElementById('purchase_date').value = '';
}

// Initialize the form
updateProductDropdowns();

function updateItemsTable() {
    const tbody = document.querySelector('#items-table tbody');
    if (!tbody) {
        console.error('Table body not found');
        return;
    }
    
    // Make sure the item list section is visible
    document.getElementById('item-list').style.display = 'block';
    
    tbody.innerHTML = '';
    
    if (addedItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No items added yet</td></tr>';
        return;
    }
    
    addedItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.make || ''}</td>
            <td>${item.model || ''}</td>
            <td>${item.size || ''}</td>
            <td>${item.watt || ''}</td>
            <td>${item.cct || ''}</td>
            <td>${parseFloat(item.costOMR || 0).toFixed(3)}</td>
            <td>${parseFloat(item.saleOMR || 0).toFixed(3)}</td>
            <td class="action-buttons">
                <button type="button" onclick="editItem(${index})" class="secondary">Edit</button>
                <button type="button" onclick="deleteItem(${index})" class="secondary">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Make these functions globally available
window.editItem = function(index) {
    const item = addedItems[index];
    
    // Populate form with item data
    document.getElementById('make').value = item.make || '';
    document.getElementById('model').value = item.model || '';
    document.getElementById('size').value = item.size || '';
    document.getElementById('body_color').value = item.bodyColor || '';
    document.getElementById('watt').value = item.watt || '';
    document.getElementById('lumens').value = item.lumens || '';
    document.getElementById('cct').value = item.cct || '';
    document.getElementById('beam_angle').value = item.beamAngle || '';
    document.getElementById('input_power').value = item.inputPower || '';
    document.getElementById('driver').value = item.driver || '';
    document.getElementById('unit_amount').value = item.unitAmount || '';
    document.getElementById('factor').value = item.factor || '';
    document.getElementById('cost_omr').value = item.costOMR || '';
    document.getElementById('sale_omr').value = item.saleOMR || '';
    document.getElementById('description').value = item.description || '';
    
    // Remove item from array
    addedItems.splice(index, 1);
    
    // Update table
    updateItemsTable();
    
    // Hide the list if empty
    if (addedItems.length === 0) {
        document.getElementById('item-list').style.display = 'none';
    }
};

window.deleteItem = function(index) {
    if (confirm('Are you sure you want to delete this item?')) {
        addedItems.splice(index, 1);
        updateItemsTable();
        
        // Hide the list if empty
        if (addedItems.length === 0) {
            document.getElementById('item-list').style.display = 'none';
        }
    }
};

// Add these new functions for the items menu
function filterItems() {
    const searchTerm = document.getElementById('itemSearch').value.toLowerCase();
    const tbody = document.querySelector('#items-table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

function sortItems() {
    const sortBy = document.getElementById('itemSort').value;
    addedItems.sort((a, b) => {
        switch(sortBy) {
            case 'make':
                return a.make.localeCompare(b.make);
            case 'model':
                return a.model.localeCompare(b.model);
            case 'price':
                return parseFloat(a.costOMR) - parseFloat(b.costOMR);
            default:
                return 0;
        }
    });
    updateItemsTable();
}

function sortByColumn(column) {
    let sortDirection = 1;
    if (window.lastSortColumn === column) {
        sortDirection = window.lastSortDirection * -1;
    }
    window.lastSortColumn = column;
    window.lastSortDirection = sortDirection;

    addedItems.sort((a, b) => {
        const aValue = a[column] || '';
        const bValue = b[column] || '';
        
        if (typeof aValue === 'number') {
            return (aValue - bValue) * sortDirection;
        }
        return aValue.toString().localeCompare(bValue.toString()) * sortDirection;
    });
    
    updateItemsTable();
}

function exportItems() {
    const csv = [
        ['Make', 'Model', 'Size', 'Watt', 'CCT', 'Cost (OMR)', 'Sale (OMR)'],
        ...addedItems.map(item => [
            item.make,
            item.model,
            item.size,
            item.watt,
            item.cct,
            item.costOMR,
            item.saleOMR
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function printItems() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Products List</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <h2>Products List</h2>
                ${document.getElementById('items-table').outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Add some CSS for the image preview
document.head.insertAdjacentHTML('beforeend', `
    <style>
        #purchase_image_preview img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid #ddd;
            margin: 5px;
        }
        
        #purchase_image_preview .no-image {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100px;
            background-color: #f5f5f5;
            color: #999;
            font-style: italic;
            border-radius: 4px;
            border: 1px dashed #ddd;
        }
    </style>
`);

function updatePurchasesTable() {
    const tbody = document.querySelector('#purchases-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (purchaseHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No purchases recorded yet</td></tr>';
        return;
    }
    
    purchaseHistory.forEach((purchase, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${purchase.date}</td>
            <td>${purchase.make}</td>
            <td>${purchase.model}</td>
            <td>${purchase.quantity}</td>
            <td>${purchase.price}</td>
            <td>${purchase.total}</td>
            <td class="action-buttons">
                <button type="button" onclick="deletePurchase(${index})" class="secondary">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterPurchases() {
    const searchTerm = document.getElementById('purchaseSearch').value.toLowerCase();
    const tbody = document.querySelector('#purchases-table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

function sortPurchases() {
    const sortBy = document.getElementById('purchaseSort').value;
    purchaseHistory.sort((a, b) => {
        switch(sortBy) {
            case 'date':
                return new Date(a.date) - new Date(b.date);
            case 'model':
                return a.model.localeCompare(b.model);
            case 'quantity':
                return a.quantity - b.quantity;
            case 'price':
                return a.price - b.price;
            default:
                return 0;
        }
    });
    updatePurchasesTable();
}

function sortPurchasesByColumn(column) {
    let sortDirection = 1;
    if (window.lastPurchaseSortColumn === column) {
        sortDirection = window.lastPurchaseSortDirection * -1;
    }
    window.lastPurchaseSortColumn = column;
    window.lastPurchaseSortDirection = sortDirection;

    purchaseHistory.sort((a, b) => {
        if (column === 'date') {
            return (new Date(a.date) - new Date(b.date)) * sortDirection;
        }
        return (a[column] - b[column]) * sortDirection;
    });
    
    updatePurchasesTable();
}

function deletePurchase(index) {
    if (confirm('Are you sure you want to delete this purchase record?')) {
        purchaseHistory.splice(index, 1);
        updatePurchasesTable();
    }
}

function exportPurchases() {
    const csv = [
        ['Date', 'Make', 'Model', 'Quantity', 'Price (OMR)', 'Total (OMR)'],
        ...purchaseHistory.map(purchase => [
            purchase.date,
            purchase.make,
            purchase.model,
            purchase.quantity,
            purchase.price,
            purchase.total
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'purchase_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function printPurchases() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Purchase History</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <h2>Purchase History</h2>
                ${document.getElementById('purchases-table').outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function clearSaleForm() {
    document.getElementById('sale_make').value = '';
    document.getElementById('sale_image_preview').innerHTML = '';
    document.getElementById('sale_price').value = '';
    document.getElementById('sale_quantity').value = '';
    document.getElementById('sale_date').value = '';
}

function updateSalesTable() {
    const tbody = document.querySelector('#sales-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (salesHistory.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No sales recorded yet</td></tr>';
        return;
    }
    
    salesHistory.forEach((sale, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.make}</td>
            <td>${sale.model}</td>
            <td>${sale.quantity}</td>
            <td>${sale.price}</td>
            <td>${sale.total}</td>
            <td class="action-buttons">
                <button type="button" onclick="deleteSale(${index})" class="secondary">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterSales() {
    const searchTerm = document.getElementById('saleSearch').value.toLowerCase();
    const tbody = document.querySelector('#sales-table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

function sortSales() {
    const sortBy = document.getElementById('saleSort').value;
    salesHistory.sort((a, b) => {
        switch(sortBy) {
            case 'date':
                return new Date(a.date) - new Date(b.date);
            case 'model':
                return a.model.localeCompare(b.model);
            case 'quantity':
                return a.quantity - b.quantity;
            case 'price':
                return a.price - b.price;
            default:
                return 0;
        }
    });
    updateSalesTable();
}

function sortSalesByColumn(column) {
    let sortDirection = 1;
    if (window.lastSaleSortColumn === column) {
        sortDirection = window.lastSaleSortDirection * -1;
    }
    window.lastSaleSortColumn = column;
    window.lastSaleSortDirection = sortDirection;

    salesHistory.sort((a, b) => {
        if (column === 'date') {
            return (new Date(a.date) - new Date(b.date)) * sortDirection;
        }
        return (a[column] - b[column]) * sortDirection;
    });
    
    updateSalesTable();
}

function deleteSale(index) {
    if (confirm('Are you sure you want to delete this sale record?')) {
        salesHistory.splice(index, 1);
        updateSalesTable();
    }
}

function exportSales() {
    const csv = [
        ['Date', 'Make', 'Model', 'Quantity', 'Price (OMR)', 'Total (OMR)'],
        ...salesHistory.map(sale => [
            sale.date,
            sale.make,
            sale.model,
            sale.quantity,
            sale.price,
            sale.total
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sales_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function printSales() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Sales History</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <h2>Sales History</h2>
                ${document.getElementById('sales-table').outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Function to calculate and update stock
function updateStock() {
    stockItems = [];
    
    // Create a map to track stock for each product
    const stockMap = new Map();
    
    // Process all added items first
    addedItems.forEach(item => {
        stockMap.set(item.model, {
            make: item.make,
            model: item.model,
            purchased: 0,
            sold: 0,
            available: 0,
            costPrice: parseFloat(item.costOMR),
            salePrice: parseFloat(item.saleOMR),
            imagePreview: item.imagePreview
        });
    });
    
    // Add purchase quantities
    purchaseHistory.forEach(purchase => {
        const stock = stockMap.get(purchase.model);
        if (stock) {
            stock.purchased += purchase.quantity;
            stock.available += purchase.quantity;
        }
    });
    
    // Subtract sale quantities
    salesHistory.forEach(sale => {
        const stock = stockMap.get(sale.model);
        if (stock) {
            stock.sold += sale.quantity;
            stock.available -= sale.quantity;
        }
    });
    
    // Convert map to array and calculate values
    stockItems = Array.from(stockMap.values()).map(item => ({
        ...item,
        costValue: (item.available * item.costPrice).toFixed(3),
        saleValue: (item.available * item.salePrice).toFixed(3)
    }));
    
    updateStockTable();
}

function updateStockTable() {
    const tbody = document.querySelector('#stock-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (stockItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No stock items available</td></tr>';
        return;
    }
    
    stockItems.forEach((item, index) => {
        const row = document.createElement('tr');
        const stockStatus = item.available < 5 ? 'low-stock' : '';
        row.innerHTML = `
            <td>${item.make}</td>
            <td>${item.model}</td>
            <td>${item.purchased}</td>
            <td>${item.sold}</td>
            <td class="${stockStatus}">${item.available}</td>
            <td>${item.costValue}</td>
            <td>${item.saleValue}</td>
            <td class="action-buttons">
                <button type="button" onclick="viewStockDetails(${index})" class="secondary">Details</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function filterStock() {
    const searchTerm = document.getElementById('stockSearch').value.toLowerCase();
    const tbody = document.querySelector('#stock-table tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    }
}

function sortStock() {
    const sortBy = document.getElementById('stockSort').value;
    stockItems.sort((a, b) => {
        switch(sortBy) {
            case 'model':
                return a.model.localeCompare(b.model);
            case 'make':
                return a.make.localeCompare(b.make);
            case 'quantity':
                return b.available - a.available;
            case 'value':
                return parseFloat(b.saleValue) - parseFloat(a.saleValue);
            default:
                return 0;
        }
    });
    updateStockTable();
}

function sortStockByColumn(column) {
    let sortDirection = 1;
    if (window.lastStockSortColumn === column) {
        sortDirection = window.lastStockSortDirection * -1;
    }
    window.lastStockSortColumn = column;
    window.lastStockSortDirection = sortDirection;

    stockItems.sort((a, b) => {
        if (typeof a[column] === 'string') {
            return a[column].localeCompare(b[column]) * sortDirection;
        }
        return (a[column] - b[column]) * sortDirection;
    });
    
    updateStockTable();
}

function viewStockDetails(index) {
    const item = stockItems[index];
    const detailsWindow = window.open('', '_blank');
    detailsWindow.document.write(`
        <html>
            <head>
                <title>Stock Details - ${item.model}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                    .image-preview { margin: 20px 0; }
                    .image-preview img { max-width: 200px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                </style>
            </head>
            <body>
                <h2>Stock Details: ${item.model}</h2>
                <div class="details-grid">
                    <div>
                        <h3>Product Information</h3>
                        <p><strong>Make:</strong> ${item.make}</p>
                        <p><strong>Model:</strong> ${item.model}</p>
                        <p><strong>Cost Price:</strong> ${item.costPrice.toFixed(3)} OMR</p>
                        <p><strong>Sale Price:</strong> ${item.salePrice.toFixed(3)} OMR</p>
                    </div>
                    <div>
                        <h3>Stock Information</h3>
                        <p><strong>Total Purchased:</strong> ${item.purchased}</p>
                        <p><strong>Total Sold:</strong> ${item.sold}</p>
                        <p><strong>Available Stock:</strong> ${item.available}</p>
                        <p><strong>Stock Value:</strong> ${item.saleValue} OMR</p>
                    </div>
                </div>
                <div class="image-preview">
                    <h3>Product Image</h3>
                    ${item.imagePreview || 'No image available'}
                </div>
            </body>
        </html>
    `);
}

function exportStock() {
    const csv = [
        ['Make', 'Model', 'Total Purchased', 'Total Sold', 'Available Stock', 'Cost Value (OMR)', 'Sale Value (OMR)'],
        ...stockItems.map(item => [
            item.make,
            item.model,
            item.purchased,
            item.sold,
            item.available,
            item.costValue,
            item.saleValue
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

function printStock() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Stock Report</title>
                <style>
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .low-stock { color: red; font-weight: bold; }
                </style>
            </head>
            <body>
                <h2>Stock Report</h2>
                ${document.getElementById('stock-table').outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Report functions
function changeReportType() {
    const reportType = document.getElementById('report-type').value;
    generateReport();
}

// Add this new function to initialize the report
function initializeReport() {
    console.log('Initializing report...');
    const reportContent = document.getElementById('report-content');
    console.log('Report content element:', reportContent);
    
    // Set default dates and generate report
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const startDateInput = document.getElementById('report-start-date');
    const endDateInput = document.getElementById('report-end-date');
    
    console.log('Date inputs:', { startDateInput, endDateInput });
    
    if (startDateInput && endDateInput) {
        startDateInput.value = firstDay.toISOString().split('T')[0];
        endDateInput.value = lastDay.toISOString().split('T')[0];
    }
    
    generateReport();
}

function exportReport() {
    const reportType = document.getElementById('report-type').value;
    const table = document.getElementById('report-table');
    
    // Convert table to CSV
    const rows = Array.from(table.querySelectorAll('tr'));
    const csv = rows.map(row => {
        return Array.from(row.querySelectorAll('th,td'))
            .map(cell => cell.textContent)
            .join(',');
    }).join('\n');
    
    // Download CSV file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

function printReport() {
    const reportType = document.getElementById('report-type').value;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .summary-cards { display: flex; gap: 20px; margin-bottom: 20px; }
                    .summary-card { padding: 15px; border: 1px solid #ddd; border-radius: 4px; }
                </style>
            </head>
            <body>
                <h2>${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
                <div class="summary-cards">
                    ${document.querySelector('.report-summary').innerHTML}
                </div>
                ${document.getElementById('report-table').outerHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// Add event listeners for the report controls
document.getElementById('report-type')?.addEventListener('change', generateReport);
document.getElementById('report-start-date')?.addEventListener('change', generateReport);
document.getElementById('report-end-date')?.addEventListener('change', generateReport);

// Add CSS to ensure report content is visible
const style = document.createElement('style');
style.textContent = `
    #report-content {
        display: block !important;
    }
    .report-summary {
        display: grid !important;
    }
    .report-details {
        display: block !important;
    }
`;
document.head.appendChild(style);

// Function to update the product catalog display
function updateCatalog() {
    const catalogGrid = document.querySelector('.catalog-grid');
    const searchTerm = document.getElementById('catalogSearch').value.toLowerCase();
    
    // Filter products based on search term
    const filteredProducts = addedItems.filter(product => 
        product.make.toLowerCase().includes(searchTerm) ||
        product.model.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    catalogGrid.innerHTML = filteredProducts.map((product) => {
        // Get the actual index from the addedItems array
        const idx = addedItems.indexOf(product);
        return `
            <div class="product-card">
                <div class="image-container">
                    ${product.imagePreview || '<div class="no-image">No image available</div>'}
                </div>
                <h4>${product.make} - ${product.model}</h4>
                <div class="product-details">
                    <div class="detail-item">
                        <span class="label">Size:</span>
                        <span class="value">${product.size}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Watt:</span>
                        <span class="value">${product.watt}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Lumens:</span>
                        <span class="value">${product.lumens}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">CCT:</span>
                        <span class="value">${product.cct}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Beam Angle:</span>
                        <span class="value">${product.beamAngle}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Body Color:</span>
                        <span class="value">${product.bodyColor}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Driver:</span>
                        <span class="value">${product.driver}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Price:</span>
                        <span class="value">${parseFloat(product.saleOMR).toFixed(3)} OMR</span>
                    </div>
                </div>
                <div class="product-description">
                    <p>${product.description || 'No description available'}</p>
                    <button onclick="viewProductDetail(${idx})">View Details</button>
                </div>
            </div>
        `;
    }).join('');
}

// Function to filter catalog
function filterCatalog() {
    updateCatalog();
}

// Function to sort catalog
function sortCatalog() {
    const sortBy = document.getElementById('catalogSort').value;
    
    addedItems.sort((a, b) => {
        switch(sortBy) {
            case 'make':
                return a.make.localeCompare(b.make);
            case 'model':
                return a.model.localeCompare(b.model);
            case 'watt':
                return parseFloat(a.watt) - parseFloat(b.watt);
            case 'price':
                return parseFloat(a.saleOMR) - parseFloat(b.saleOMR);
            default:
                return 0;
        }
    });
    
    updateCatalog();
}

// Function to export catalog
function exportCatalog() {
    const csv = [
        ['Make', 'Model', 'Size', 'Watt', 'Lumens', 'CCT', 'Beam Angle', 'Body Color', 'Driver', 'Price (OMR)', 'Description'],
        ...addedItems.map(product => [
            product.make,
            product.model,
            product.size,
            product.watt,
            product.lumens,
            product.cct,
            product.beamAngle,
            product.bodyColor,
            product.driver,
            parseFloat(product.saleOMR).toFixed(3),
            product.description
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_catalog.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Function to print catalog
function printCatalog() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Product Catalog</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .catalog-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
                    .product-card { border: 1px solid #ddd; padding: 15px; margin-bottom: 20px; }
                    .product-details { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
                    .image-container { max-width: 200px; margin-bottom: 10px; }
                    .image-container img { max-width: 100%; height: auto; }
                    h4 { margin: 0 0 10px 0; }
                    @media print {
                        .product-card { break-inside: avoid; }
                    }
                </style>
            </head>
            <body>
                <h2>Product Catalog</h2>
                <div class="catalog-grid">
                    ${document.querySelector('.catalog-grid').innerHTML}
                </div>
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Update catalog when products are added
document.getElementById('product-form').addEventListener('submit', function(e) {
    // ... existing code ...
    updateCatalog(); // Add this line to update the catalog
});

// Initial catalog update
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    updateCatalog(); // Add this line to show initial catalog
});

// Function to view full product details in a modal
function viewProductDetail(index) {
    const product = addedItems[index];
    if (!product) return;
    
    // Create a modal element
    const modal = document.createElement('div');
    modal.classList.add('product-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>${product.make} - ${product.model}</h2>
            <div class="modal-image">
                ${product.imagePreview || '<div class="no-image">No image available</div>'}
            </div>
            <div class="modal-details">
                <p><strong>Size:</strong> ${product.size}</p>
                <p><strong>Watt:</strong> ${product.watt}</p>
                <p><strong>Lumens:</strong> ${product.lumens}</p>
                <p><strong>CCT:</strong> ${product.cct}</p>
                <p><strong>Beam Angle:</strong> ${product.beamAngle}</p>
                <p><strong>Body Color:</strong> ${product.bodyColor}</p>
                <p><strong>Driver:</strong> ${product.driver}</p>
                <p><strong>Unit Amount:</strong> ${product.unitAmount}</p>
                <p><strong>Cost (OMR):</strong> ${parseFloat(product.costOMR).toFixed(3)} OMR</p>
                <p><strong>Sale (OMR):</strong> ${parseFloat(product.saleOMR).toFixed(3)} OMR</p>
                <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
} 