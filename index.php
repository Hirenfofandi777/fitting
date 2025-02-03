<?php
session_start();
// Add a small delay to simulate loading (optional)
// sleep(1);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Management System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading...</div>
    </div>

    <div class="content" style="display: none;">
        <header class="company-header">
            <div class="header-text">
                <h1>Al Sabbagh Trading Co. LLC</h1>
                <h2>Light Fitting Schedule</h2>
            </div>
        </header>

        <nav class="menu">
            <ul>
                <li><a href="#" onclick="showSection('new-product')">New Product</a></li>
                <li><a href="#" onclick="showSection('purchase-entry')">Purchase Entry</a></li>
                <li><a href="#" onclick="showSection('sale-entry')">Sale Entry</a></li>
                <li><a href="#" onclick="showSection('stock')">Stock</a></li>
                <li><a href="#" onclick="showSection('report')">Report</a></li>
                <li><a href="#" onclick="showSection('product-catalog')">Product Catalog</a></li>
            </ul>
        </nav>

        <div id="new-product" class="section">
            <h2>New Product</h2>
            <form id="product-form" enctype="multipart/form-data">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="make">Make</label>
                        <input type="text" id="make" name="make" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="model">Model No</label>
                        <input type="text" id="model" name="model" required>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="pictures">Pictures</label>
                        <input type="file" id="pictures" name="pictures" accept="image/*" multiple>
                        <div id="image-preview" class="image-preview"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="size">Size</label>
                        <input type="text" id="size" name="size" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="body_color">Body Color</label>
                        <input type="text" id="body_color" name="body_color" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="watt">Watt</label>
                        <input type="number" id="watt" name="watt" step="0.1" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="lumens">Lumens</label>
                        <input type="number" id="lumens" name="lumens" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="cct">CCT</label>
                        <input type="text" id="cct" name="cct" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="beam_angle">Beam Angle</label>
                        <input type="text" id="beam_angle" name="beam_angle" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="input_power">Input Power</label>
                        <input type="text" id="input_power" name="input_power" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="driver">Driver</label>
                        <input type="text" id="driver" name="driver" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="unit_amount">Unit Amount ($)</label>
                        <input type="number" id="unit_amount" name="unit_amount" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="factor">Factor (OMR)</label>
                        <input type="number" id="factor" name="factor" step="0.01" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="cost_omr">Cost (OMR)</label>
                        <input type="number" id="cost_omr" name="cost_omr" step="0.001" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="sale_omr">Sale (OMR)</label>
                        <input type="number" id="sale_omr" name="sale_omr" step="0.001" required>
                    </div>

                    <div class="form-group full-width">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="4" placeholder="Enter product description..."></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit">Add Product</button>
                    <button type="reset" class="secondary">Clear Form</button>
                </div>
            </form>

            <!-- Add the list menu -->
            <div class="items-menu">
                <div class="menu-header">
                    <h3>Added Products</h3>
                    <div class="menu-actions">
                        <button type="button" onclick="exportItems()" class="secondary">Export</button>
                        <button type="button" onclick="printItems()" class="secondary">Print</button>
                    </div>
                </div>
                <div class="menu-filters">
                    <input type="text" id="itemSearch" placeholder="Search items..." onkeyup="filterItems()">
                    <select id="itemSort" onchange="sortItems()">
                        <option value="date">Date Added</option>
                        <option value="make">Make</option>
                        <option value="model">Model</option>
                        <option value="price">Price</option>
                    </select>
                </div>
                <div id="item-list" class="item-list-section">
                    <table id="items-table">
                        <thead>
                            <tr>
                                <th onclick="sortByColumn('make')">Make ↕</th>
                                <th onclick="sortByColumn('model')">Model ↕</th>
                                <th onclick="sortByColumn('size')">Size ↕</th>
                                <th onclick="sortByColumn('watt')">Watt ↕</th>
                                <th onclick="sortByColumn('cct')">CCT ↕</th>
                                <th onclick="sortByColumn('costOMR')">Cost (OMR) ↕</th>
                                <th onclick="sortByColumn('saleOMR')">Sale (OMR) ↕</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Items will be added here dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="purchase-entry" class="section">
            <h2>Purchase Entry</h2>
            <form id="purchase-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="purchase_model">Model No</label>
                        <select id="purchase_model" required>
                            <option value="">Select Model</option>
                            <!-- Models will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="purchase_make">Make</label>
                        <input type="text" id="purchase_make" readonly>
                    </div>

                    <div class="form-group full-width">
                        <label>Product Image</label>
                        <div id="purchase_image_preview" class="image-preview"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="purchase_quantity">Quantity</label>
                        <input type="number" id="purchase_quantity" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="purchase_price">Purchase Price</label>
                        <input type="number" id="purchase_price" step="0.001" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="purchase_date">Purchase Date</label>
                        <input type="date" id="purchase_date" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit">Add Purchase</button>
                    <button type="reset" class="secondary">Clear Form</button>
                </div>
            </form>

            <!-- Add Purchase View Menu -->
            <div class="items-menu">
                <div class="menu-header">
                    <h3>Purchase History</h3>
                    <div class="menu-actions">
                        <button type="button" onclick="exportPurchases()" class="secondary">Export</button>
                        <button type="button" onclick="printPurchases()" class="secondary">Print</button>
                    </div>
                </div>
                <div class="menu-filters">
                    <input type="text" id="purchaseSearch" placeholder="Search purchases..." onkeyup="filterPurchases()">
                    <select id="purchaseSort" onchange="sortPurchases()">
                        <option value="date">Date</option>
                        <option value="model">Model</option>
                        <option value="quantity">Quantity</option>
                        <option value="price">Price</option>
                    </select>
                </div>
                <div id="purchase-list" class="item-list-section">
                    <table id="purchases-table">
                        <thead>
                            <tr>
                                <th onclick="sortPurchasesByColumn('date')">Date ↕</th>
                                <th onclick="sortPurchasesByColumn('make')">Make ↕</th>
                                <th onclick="sortPurchasesByColumn('model')">Model ↕</th>
                                <th onclick="sortPurchasesByColumn('quantity')">Quantity ↕</th>
                                <th onclick="sortPurchasesByColumn('price')">Price (OMR) ↕</th>
                                <th onclick="sortPurchasesByColumn('total')">Total (OMR) ↕</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Purchases will be added here dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="sale-entry" class="section">
            <h2>Sale Entry</h2>
            <form id="sale-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="sale_model">Model No</label>
                        <select id="sale_model" required>
                            <option value="">Select Model</option>
                            <!-- Models will be loaded dynamically -->
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="sale_make">Make</label>
                        <input type="text" id="sale_make" readonly>
                    </div>

                    <div class="form-group full-width">
                        <label>Product Image</label>
                        <div id="sale_image_preview" class="image-preview"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="sale_quantity">Quantity</label>
                        <input type="number" id="sale_quantity" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="sale_price">Sale Price</label>
                        <input type="number" id="sale_price" step="0.001" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="sale_date">Sale Date</label>
                        <input type="date" id="sale_date" required>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit">Add Sale</button>
                    <button type="reset" class="secondary">Clear Form</button>
                </div>
            </form>

            <!-- Add Sales View Menu -->
            <div class="items-menu">
                <div class="menu-header">
                    <h3>Sales History</h3>
                    <div class="menu-actions">
                        <button type="button" onclick="exportSales()" class="secondary">Export</button>
                        <button type="button" onclick="printSales()" class="secondary">Print</button>
                    </div>
                </div>
                <div class="menu-filters">
                    <input type="text" id="saleSearch" placeholder="Search sales..." onkeyup="filterSales()">
                    <select id="saleSort" onchange="sortSales()">
                        <option value="date">Date</option>
                        <option value="model">Model</option>
                        <option value="quantity">Quantity</option>
                        <option value="price">Price</option>
                    </select>
                </div>
                <div id="sale-list" class="item-list-section">
                    <table id="sales-table">
                        <thead>
                            <tr>
                                <th onclick="sortSalesByColumn('date')">Date ↕</th>
                                <th onclick="sortSalesByColumn('make')">Make ↕</th>
                                <th onclick="sortSalesByColumn('model')">Model ↕</th>
                                <th onclick="sortSalesByColumn('quantity')">Quantity ↕</th>
                                <th onclick="sortSalesByColumn('price')">Price (OMR) ↕</th>
                                <th onclick="sortSalesByColumn('total')">Total (OMR) ↕</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Sales will be added here dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div id="stock" class="section">
            <h2>Current Stock</h2>
            
            <!-- Add stock filters and controls -->
            <div class="stock-controls">
                <div class="stock-filters">
                    <input type="text" id="stockSearch" placeholder="Search stock..." onkeyup="filterStock()">
                    <select id="stockSort" onchange="sortStock()">
                        <option value="model">Model</option>
                        <option value="make">Make</option>
                        <option value="quantity">Quantity</option>
                        <option value="value">Value</option>
                    </select>
                </div>
                <div class="stock-actions">
                    <button onclick="exportStock()" class="secondary">Export</button>
                    <button onclick="printStock()" class="secondary">Print</button>
                </div>
            </div>

            <!-- Updated stock table -->
            <table id="stock-table">
                <thead>
                    <tr>
                        <th onclick="sortStockByColumn('make')">Make ↕</th>
                        <th onclick="sortStockByColumn('model')">Model ↕</th>
                        <th onclick="sortStockByColumn('purchased')">Total Purchased ↕</th>
                        <th onclick="sortStockByColumn('sold')">Total Sold ↕</th>
                        <th onclick="sortStockByColumn('available')">Available Stock ↕</th>
                        <th onclick="sortStockByColumn('costValue')">Cost Value (OMR) ↕</th>
                        <th onclick="sortStockByColumn('saleValue')">Sale Value (OMR) ↕</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Stock data will be loaded dynamically -->
                </tbody>
            </table>
        </div>

        <!-- New Product Catalog Section -->
        <div id="product-catalog" class="section">
            <div class="product-view-menu">
               <div class="menu-header">
                   <h3>Product Catalog</h3>
                   <div class="menu-actions">
                       <button type="button" onclick="exportCatalog()" class="secondary">Export Catalog</button>
                       <button type="button" onclick="printCatalog()" class="secondary">Print Catalog</button>
                   </div>
               </div>
               <div class="menu-filters">
                   <input type="text" id="catalogSearch" placeholder="Search products..." onkeyup="filterCatalog()">
                   <select id="catalogSort" onchange="sortCatalog()">
                       <option value="make">Make</option>
                       <option value="model">Model</option>
                       <option value="watt">Watt</option>
                       <option value="price">Price</option>
                   </select>
               </div>
               <div class="catalog-grid">
                   <!-- Products will be displayed here -->
               </div>
            </div>
        </div>

        <div id="report" class="section">
            <h2>Reports</h2>
            
            <!-- Report filters and controls -->
            <div class="report-controls">
                <div class="report-filters">
                    <div class="date-range">
                        <label>Date Range:</label>
                        <input type="date" id="report-start-date">
                        <span>to</span>
                        <input type="date" id="report-end-date">
                    </div>
                    <select id="report-type" onchange="changeReportType()">
                        <option value="sales">Sales Report</option>
                        <option value="purchase">Purchase Report</option>
                        <option value="inventory">Inventory Report</option>
                        <option value="summary">Summary Report</option>
                    </select>
                </div>
                <div class="report-actions">
                    <button onclick="exportReport()" class="secondary">Export</button>
                    <button onclick="printReport()" class="secondary">Print</button>
                </div>
            </div>

            <!-- Report content area -->
            <div id="report-content">
                <!-- Summary cards -->
                <div class="report-summary">
                    <div class="summary-card">
                        <h3>Total Sales</h3>
                        <div class="amount" id="total-sales">0.000 OMR</div>
                        <div class="count" id="sales-count">0 transactions</div>
                    </div>
                    <div class="summary-card">
                        <h3>Total Purchases</h3>
                        <div class="amount" id="total-purchases">0.000 OMR</div>
                        <div class="count" id="purchase-count">0 transactions</div>
                    </div>
                    <div class="summary-card">
                        <h3>Current Stock Value</h3>
                        <div class="amount" id="stock-value">0.000 OMR</div>
                        <div class="count" id="stock-count">0 items</div>
                    </div>
                    <div class="summary-card">
                        <h3>Profit/Loss</h3>
                        <div class="amount" id="profit-loss">0.000 OMR</div>
                        <div class="count" id="profit-percentage">0%</div>
                    </div>
                </div>

                <!-- Detailed report table -->
                <div class="report-details">
                    <table id="report-table">
                        <thead>
                            <!-- Headers will be set dynamically based on report type -->
                        </thead>
                        <tbody>
                            <!-- Report data will be loaded here -->
                        </tbody>
                    </table>
                </div>

                <!-- Charts and graphs -->
                <div class="report-charts">
                    <div class="chart-container">
                        <canvas id="sales-trend-chart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="inventory-status-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html> 