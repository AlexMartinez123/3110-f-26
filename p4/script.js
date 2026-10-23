// INITIALIZE THE DATABASE

const rawCustomersJson = `
[
  {
    "customerId": "CUST-101",
    "firstName": "Marcus",
    "lastName": "Lee",
    "email": "marcus.lee@example.com",
    "phone": "555-0201",
    "address": "88 Harbor Way",
    "city": "Portland",
    "state": "OR",
    "zipCode": "97201",
    "status": "Active"
  },
  {
    "customerId": "CUST-102",
    "firstName": "Priya",
    "lastName": "Patel",
    "email": "priya.patel@example.com",
    "phone": "555-0202",
    "address": "1420 Cedar Ln",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "status": "Active"
  },
  {
    "customerId": "CUST-103",
    "firstName": "Jordan",
    "lastName": "Rivera",
    "email": "jrivera@example.com",
    "phone": "555-0203",
    "address": "305 Aspen Ct",
    "city": "Denver",
    "state": "CO",
    "zipCode": "80202",
    "status": "Inactive"
  },
  {
    "customerId": "CUST-104",
    "firstName": "Hannah",
    "lastName": "Kim",
    "email": "hannah.kim@example.com",
    "phone": "555-0204",
    "address": "42 Beacon St",
    "city": "Boston",
    "state": "MA",
    "zipCode": "02108",
    "status": "Pending"
  },
  {
    "customerId": "CUST-105",
    "firstName": "Samuel",
    "lastName": "Okafor",
    "email": "sam.okafor@example.com",
    "phone": "555-0205",
    "address": "910 Lakeview Dr",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "status": "Active"
  },
  {
    "customerId": "CUST-106",
    "firstName": "Olivia",
    "lastName": "Nguyen",
    "email": "olivia.n@example.com",
    "phone": "555-0206",
    "address": "77 Rainier Ave",
    "city": "Seattle",
    "state": "WA",
    "zipCode": "98101",
    "status": "Active"
  }
]
`;

const rawProductsJson = `
[
  {
    "productId": "PROD-001",
    "name": "Wireless Mouse",
    "category": "Electronics",
    "price": 24.99,
    "stockQuantity": 150,
    "sku": "EL-WM-100",
    "status": "In Stock"
  },
  {
    "productId": "PROD-002",
    "name": "Mechanical Keyboard",
    "category": "Electronics",
    "price": 89.99,
    "stockQuantity": 42,
    "sku": "EL-KB-200",
    "status": "In Stock"
  },
  {
    "productId": "PROD-003",
    "name": "27-inch 4K Monitor",
    "category": "Electronics",
    "price": 329.00,
    "stockQuantity": 0,
    "sku": "EL-MN-270",
    "status": "Out of Stock"
  },
  {
    "productId": "PROD-004",
    "name": "Ergonomic Office Chair",
    "category": "Furniture",
    "price": 249.50,
    "stockQuantity": 18,
    "sku": "FN-CH-400",
    "status": "In Stock"
  },
  {
    "productId": "PROD-005",
    "name": "Standing Desk",
    "category": "Furniture",
    "price": 499.00,
    "stockQuantity": 5,
    "sku": "FN-DK-500",
    "status": "Low Stock"
  },
  {
    "productId": "PROD-006",
    "name": "USB-C Hub",
    "category": "Accessories",
    "price": 39.95,
    "stockQuantity": 230,
    "sku": "AC-HB-600",
    "status": "In Stock"
  }
]
`;

const rawOfficesJson = `
[
  {
    "officeId": "OFF-01",
    "officeName": "Headquarters",
    "address": "500 Commerce Blvd",
    "city": "San Francisco",
    "state": "CA",
    "zipCode": "94105",
    "phone": "555-1000",
    "manager": "Linda Torres",
    "employeeCount": 120
  },
  {
    "officeId": "OFF-02",
    "officeName": "East Coast Office",
    "address": "200 Madison Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10016",
    "phone": "555-2000",
    "manager": "Kevin Walsh",
    "employeeCount": 65
  },
  {
    "officeId": "OFF-03",
    "officeName": "Midwest Office",
    "address": "150 Wacker Dr",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60606",
    "phone": "555-3000",
    "manager": "Aisha Johnson",
    "employeeCount": 40
  },
  {
    "officeId": "OFF-04",
    "officeName": "Southwest Office",
    "address": "300 Congress Ave",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "phone": "555-4000",
    "manager": "Daniel Chen",
    "employeeCount": 28
  }
]
`;

// "Ingest" each JSON document by parsing the raw strings into JavaScript arrays.
// const still works here because push() and splice() change what is INSIDE the
// array. We never reassign the variable itself, which is what const forbids.
const customers = JSON.parse(rawCustomersJson);
const products = JSON.parse(rawProductsJson);
const offices = JSON.parse(rawOfficesJson);

// Find the containers where the cards are displayed
const customerContainer = document.getElementById('customer-container');
const productContainer = document.getElementById('product-container');
const officeContainer = document.getElementById('office-container');

// TABS

function showTab(tabName) {
  for (const panel of document.querySelectorAll('.tab-panel')) {
    panel.hidden = panel.id !== `${tabName}-panel`;
  }
  for (const tab of document.querySelectorAll('.tab')) {
    const isActive = tab.dataset.tab === tabName;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive);
  }
}

// RENDER FUNCTIONS
// Each function clears its container and rebuilds every card from the array.
//
// The important part for project 4: we loop with forEach, which hands us the
// INDEX of each item along with the item itself. That index gets baked into
// the card's Delete button, so the button knows which array slot to remove.
//
// Because we rebuild the whole list after every change, the indexes are always
// recalculated from scratch. Delete index 1 out of six cards and the old index
// 2 becomes the new index 1 on the very next render, so the next click is
// still pointing at the right record.

function renderCustomers() {
  customerContainer.innerHTML = '';

  customers.forEach((customer, index) => {
    const id = customer.customerId;
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const email = customer.email;
    const phone = customer.phone;
    const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
    const status = customer.status;

    const cardDiv = document.createElement('div');
    cardDiv.className = `card status-${status.toLowerCase()}`;

    cardDiv.innerHTML = `
      <h3>${escapeHtml(fullName)}</h3>
      <div class="card-id-row">
        <p class="record-id">${escapeHtml(id)}</p>
        <span class="index-chip">index ${index}</span>
      </div>
      <div class="card-details">
        <p>${escapeHtml(email)}</p>
        <p>${escapeHtml(phone)}</p>
        <p>${escapeHtml(address)}</p>
      </div>
      <div class="card-footer">
        <span class="status">${escapeHtml(status)}</span>
        <button class="delete-btn" onclick="deleteCustomer(${index})" aria-label="Delete ${escapeHtml(fullName)}">Delete</button>
      </div>
    `;

    customerContainer.appendChild(cardDiv);
  });

  // If the user deleted everything, say so instead of leaving a blank panel
  if (customers.length === 0) {
    customerContainer.innerHTML = '<p class="empty">No customers left. Add one with the form.</p>';
  }

  document.getElementById('customer-count').textContent = customers.length;
  document.getElementById('customer-summary').textContent =
    `${customers.length} customers on file`;
}

function renderProducts() {
  productContainer.innerHTML = '';

  let totalInventoryValue = 0;

  products.forEach((product, index) => {
    const id = product.productId;
    const name = product.name;
    const category = product.category;
    const price = `$${product.price.toFixed(2)}`;
    const stock = product.stockQuantity;
    const sku = product.sku;
    const status = product.status;

    totalInventoryValue += product.price * product.stockQuantity;

    const cardDiv = document.createElement('div');
    // "In Stock" becomes "status-in-stock" so it works as a CSS class
    cardDiv.className = `card status-${status.toLowerCase().replaceAll(' ', '-')}`;

    cardDiv.innerHTML = `
      <h3>${escapeHtml(name)}</h3>
      <div class="card-id-row">
        <p class="record-id">${escapeHtml(id)}</p>
        <span class="index-chip">index ${index}</span>
      </div>
      <div class="card-details">
        <p>${escapeHtml(category)} | SKU ${escapeHtml(sku)}</p>
        <p>${price} each</p>
        <p>${stock} units in stock</p>
      </div>
      <div class="card-footer">
        <span class="status">${escapeHtml(status)}</span>
        <button class="delete-btn" onclick="deleteProduct(${index})" aria-label="Delete ${escapeHtml(name)}">Delete</button>
      </div>
    `;

    productContainer.appendChild(cardDiv);
  });

  if (products.length === 0) {
    productContainer.innerHTML = '<p class="empty">No products left. Add one with the form.</p>';
  }

  document.getElementById('product-count').textContent = products.length;
  document.getElementById('product-summary').textContent =
    `${products.length} products | $${totalInventoryValue.toFixed(2)} total inventory value`;
}

function renderOffices() {
  officeContainer.innerHTML = '';

  let totalEmployees = 0;

  offices.forEach((office, index) => {
    const id = office.officeId;
    const name = office.officeName;
    const address = `${office.address}, ${office.city}, ${office.state} ${office.zipCode}`;
    const phone = office.phone;
    const manager = office.manager;
    const employees = office.employeeCount;

    totalEmployees += employees;

    const cardDiv = document.createElement('div');
    cardDiv.className = 'card office';

    cardDiv.innerHTML = `
      <h3>${escapeHtml(name)}</h3>
      <div class="card-id-row">
        <p class="record-id">${escapeHtml(id)}</p>
        <span class="index-chip">index ${index}</span>
      </div>
      <div class="card-details">
        <p>${escapeHtml(address)}</p>
        <p>${escapeHtml(phone)}</p>
        <p>Managed by ${escapeHtml(manager)}</p>
      </div>
      <div class="card-footer">
        <span class="status">${employees} employees</span>
        <button class="delete-btn" onclick="deleteOffice(${index})" aria-label="Delete ${escapeHtml(name)}">Delete</button>
      </div>
    `;

    officeContainer.appendChild(cardDiv);
  });

  if (offices.length === 0) {
    officeContainer.innerHTML = '<p class="empty">No offices left. Add one with the form.</p>';
  }

  document.getElementById('office-count').textContent = offices.length;
  document.getElementById('office-summary').textContent =
    `${offices.length} offices | ${totalEmployees} employees total`;
}

// Draw all three lists once when the page loads
renderCustomers();
renderProducts();
renderOffices();

// HELPERS

function getValue(inputId) {
  return document.getElementById(inputId).value.trim();
}

// The cards are built with innerHTML, so any < or " a user types into the form
// would otherwise be read as HTML and break the card. This turns those
// characters into harmless text.
function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function showMessage(messageId, text, isError) {
  const message = document.getElementById(messageId);
  message.textContent = text;
  message.className = isError ? 'form-message error' : 'form-message success';
}

// Wipe every form message. Called before a delete so an old Undo button from a
// different tab can't linger and undo the wrong thing.
function clearMessages() {
  for (const message of document.querySelectorAll('.form-message')) {
    message.textContent = '';
    message.className = 'form-message';
  }
}

// Briefly highlight the newest card so it's easy to see what changed
function highlightNewest(container) {
  const newest = container.lastElementChild;
  newest.classList.add('just-added');
  newest.scrollIntoView({ block: 'nearest' });
}

// ADD FUNCTIONS
// Each one runs when its form is submitted. It reads the inputs, checks the
// array for a duplicate ID, pushes the new object, and re-renders the cards.

function addCustomer(event) {
  event.preventDefault(); // stop the browser from reloading the page

  const newCustomer = {
    customerId: getValue('customerId'),
    firstName: getValue('customerFirstName'),
    lastName: getValue('customerLastName'),
    email: getValue('customerEmail'),
    phone: getValue('customerPhone'),
    address: getValue('customerAddress'),
    city: getValue('customerCity'),
    state: getValue('customerState').toUpperCase(),
    zipCode: getValue('customerZip'),
    status: getValue('customerStatus')
  };

  // Read from the array first: .some() is true if any customer already has this ID
  if (customers.some(customer => customer.customerId === newCustomer.customerId)) {
    showMessage('customer-message', `${newCustomer.customerId} is already in use. Enter a different customer ID.`, true);
    return;
  }

  customers.push(newCustomer);
  event.target.reset(); // clear the form for the next entry

  renderCustomers();
  highlightNewest(customerContainer);
  showMessage('customer-message', `Added ${newCustomer.firstName} ${newCustomer.lastName}.`, false);

  console.log(`Customer added! Total customers in array: ${customers.length}`);
  console.log(newCustomer);
}

function addProduct(event) {
  event.preventDefault();

  const newProduct = {
    productId: getValue('productId'),
    name: getValue('productName'),
    category: getValue('productCategory'),
    price: parseFloat(getValue('productPrice')), // convert text to a number
    stockQuantity: parseInt(getValue('productStock')),
    sku: getValue('productSku'),
    status: getValue('productStatus')
  };

  if (products.some(product => product.productId === newProduct.productId)) {
    showMessage('product-message', `${newProduct.productId} is already in use. Enter a different product ID.`, true);
    return;
  }

  products.push(newProduct);
  event.target.reset();

  renderProducts();
  highlightNewest(productContainer);
  showMessage('product-message', `Added ${newProduct.name}.`, false);

  console.log(`Product added! Total products in array: ${products.length}`);
  console.log(newProduct);
}

function addOffice(event) {
  event.preventDefault();

  const newOffice = {
    officeId: getValue('officeId'),
    officeName: getValue('officeName'),
    address: getValue('officeAddress'),
    city: getValue('officeCity'),
    state: getValue('officeState').toUpperCase(),
    zipCode: getValue('officeZip'),
    phone: getValue('officePhone'),
    manager: getValue('officeManager'),
    employeeCount: parseInt(getValue('officeEmployees'))
  };

  if (offices.some(office => office.officeId === newOffice.officeId)) {
    showMessage('office-message', `${newOffice.officeId} is already in use. Enter a different office ID.`, true);
    return;
  }

  offices.push(newOffice);
  event.target.reset();

  renderOffices();
  highlightNewest(officeContainer);
  showMessage('office-message', `Added ${newOffice.officeName}.`, false);

  console.log(`Office added! Total offices in array: ${offices.length}`);
  console.log(newOffice);
}

// DELETE FUNCTIONS (PROJECT 4)
//
// Every Delete button was rendered with its own array index baked in, so when
// one is clicked the function receives the exact position to remove.
//
// Array.splice() is what does the work. It takes the index to start at and how
// many items to remove, so splice(index, 1) deletes exactly one record. It
// also RETURNS an array of whatever it pulled out, which is how we grab the
// deleted object to power the Undo button.

let lastDelete = null; // remembers the most recent delete so it can be undone

function deleteCustomer(index) {
  const [removed] = customers.splice(index, 1);

  rememberDelete(customers, index, removed, renderCustomers,
    `${removed.firstName} ${removed.lastName}`, 'customer-message');

  renderCustomers(); // redraw so every remaining card gets a fresh index

  console.log(`Customer deleted at index ${index}! Total customers in array: ${customers.length}`);
  console.log(removed);
}

function deleteProduct(index) {
  const [removed] = products.splice(index, 1);

  rememberDelete(products, index, removed, renderProducts,
    removed.name, 'product-message');

  renderProducts();

  console.log(`Product deleted at index ${index}! Total products in array: ${products.length}`);
  console.log(removed);
}

function deleteOffice(index) {
  const [removed] = offices.splice(index, 1);

  rememberDelete(offices, index, removed, renderOffices,
    removed.officeName, 'office-message');

  renderOffices();

  console.log(`Office deleted at index ${index}! Total offices in array: ${offices.length}`);
  console.log(removed);
}

// Store everything needed to reverse the delete, then show the Undo button
function rememberDelete(list, index, item, render, label, messageId) {
  lastDelete = { list, index, item, render, label, messageId };

  clearMessages();
  const message = document.getElementById(messageId);
  message.className = 'form-message success';
  message.innerHTML =
    `Deleted ${escapeHtml(label)}. <button type="button" class="undo-btn" onclick="undoDelete()">Undo</button>`;
}

function undoDelete() {
  if (lastDelete === null) {
    return;
  }

  const { list, index, item, render, label, messageId } = lastDelete;

  // splice inserts as well as removes: start at index, remove 0 items, and add
  // the saved record back, which drops it into the exact slot it came from.
  list.splice(index, 0, item);
  lastDelete = null;

  render();
  showMessage(messageId, `Restored ${label}.`, false);

  console.log(`Undo! ${label} put back at index ${index}. Array length is now ${list.length}.`);
}
