// ============================================================
// PROJECT 6 - UNIFIED CRUD
//
// Pulling together the earlier projects:
//   Project 1 - iterating the arrays and printing reports to the console
//   Project 2 - writing that data into the page instead of just logging it
//   Project 3 - three data sets behind tabs, with running totals
//   Project 4 - card based UI that DELETES by array index
//   Project 5 - a popup modal that EDITS a record and saves it back
//   Project 6 - one modal that handles BOTH create and update
//
//   CREATE  -> openModal(type)            then push()
//   READ    -> renderCustomers() etc.     plus printConsoleReport()
//   UPDATE  -> openModal(type, index)     then array[index] = formData
//   DELETE  -> deleteCustomer(index)      then splice(index, 1)
// ============================================================

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
// const still works here because push(), splice() and replacing one slot all
// change what is INSIDE the array. We never reassign the variable itself,
// which is the only thing const actually forbids.
const customers = JSON.parse(rawCustomersJson);
const products = JSON.parse(rawProductsJson);
const offices = JSON.parse(rawOfficesJson);

// Find the containers where the cards are displayed
const customerContainer = document.getElementById('customer-container');
const productContainer = document.getElementById('product-container');
const officeContainer = document.getElementById('office-container');

// MODAL STATE
// One popup serves three data sets and two jobs, so while it is open it has to
// remember what it is working on:
//   currentEditType  - which array ('customer', 'product', 'office')
//   currentEditIndex - which slot, or NULL when we are creating a new record
// That null is the whole trick behind the unified modal: null means "add".
let currentEditType = null;
let currentEditIndex = null;

// Everything the shared modal and the save helpers need to know per type,
// so the generic parts don't have to repeat the same if/else three times.
const TYPES = {
  customer: {
    list: customers, container: customerContainer, render: renderCustomers,
    messageId: 'customer-message', searchId: 'customer-search',
    addTitle: 'Add a customer', editTitle: 'Edit customer', addButton: 'Add customer'
  },
  product: {
    list: products, container: productContainer, render: renderProducts,
    messageId: 'product-message', searchId: 'product-search',
    addTitle: 'Add a product', editTitle: 'Edit product', addButton: 'Add product'
  },
  office: {
    list: offices, container: officeContainer, render: renderOffices,
    messageId: 'office-message', searchId: 'office-search',
    addTitle: 'Add an office', editTitle: 'Edit office', addButton: 'Add office'
  }
};

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

// ============ READ ============
// Each render clears its container and rebuilds the cards from its array.
//
// The search box filters which cards are drawn, which creates the one trap in
// this whole project: the filtered list has its own positions, but Edit and
// Delete must act on the REAL array. So every match is paired with its
// original index, and that original index is what goes on the buttons.

function matchesRecord(record, query) {
  if (query === '') {
    return true;
  }
  // Join all of the record's values into one string and search that
  return Object.values(record).join(' ').toLowerCase().includes(query);
}

function renderCustomers() {
  const query = getValue('customer-search').toLowerCase();
  customerContainer.innerHTML = '';

  const matches = [];
  customers.forEach((customer, index) => {
    if (matchesRecord(customer, query)) {
      matches.push({ customer, index });
    }
  });

  for (const match of matches) {
    const customer = match.customer;
    const index = match.index; // position in `customers`, not in `matches`

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
        <div class="card-actions">
          <button class="edit-btn" onclick="openModal('customer', ${index})" aria-label="Edit ${escapeHtml(fullName)}">Edit</button>
          <button class="delete-btn" onclick="deleteCustomer(${index})" aria-label="Delete ${escapeHtml(fullName)}">Delete</button>
        </div>
      </div>
    `;

    customerContainer.appendChild(cardDiv);
  }

  if (customers.length === 0) {
    customerContainer.innerHTML = '<p class="empty">No customers yet. Use the Add customer button to create one.</p>';
  } else if (matches.length === 0) {
    customerContainer.innerHTML = `<p class="empty">No customers match "${escapeHtml(query)}".</p>`;
  }

  document.getElementById('customer-count').textContent = customers.length;
  document.getElementById('customer-summary').textContent = query
    ? `Showing ${matches.length} of ${customers.length} customers`
    : `${customers.length} customers on file`;
}

function renderProducts() {
  const query = getValue('product-search').toLowerCase();
  productContainer.innerHTML = '';

  // The inventory total is a business number, so it covers the whole array
  // rather than only whatever the search happens to be showing.
  let totalInventoryValue = 0;
  for (const product of products) {
    totalInventoryValue += product.price * product.stockQuantity;
  }

  const matches = [];
  products.forEach((product, index) => {
    if (matchesRecord(product, query)) {
      matches.push({ product, index });
    }
  });

  for (const match of matches) {
    const product = match.product;
    const index = match.index;

    const id = product.productId;
    const name = product.name;
    const category = product.category;
    const price = `$${product.price.toFixed(2)}`;
    const stock = product.stockQuantity;
    const sku = product.sku;
    const status = product.status;

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
        <div class="card-actions">
          <button class="edit-btn" onclick="openModal('product', ${index})" aria-label="Edit ${escapeHtml(name)}">Edit</button>
          <button class="delete-btn" onclick="deleteProduct(${index})" aria-label="Delete ${escapeHtml(name)}">Delete</button>
        </div>
      </div>
    `;

    productContainer.appendChild(cardDiv);
  }

  if (products.length === 0) {
    productContainer.innerHTML = '<p class="empty">No products yet. Use the Add product button to create one.</p>';
  } else if (matches.length === 0) {
    productContainer.innerHTML = `<p class="empty">No products match "${escapeHtml(query)}".</p>`;
  }

  document.getElementById('product-count').textContent = products.length;
  document.getElementById('product-summary').textContent = query
    ? `Showing ${matches.length} of ${products.length} products | $${totalInventoryValue.toFixed(2)} total inventory value`
    : `${products.length} products | $${totalInventoryValue.toFixed(2)} total inventory value`;
}

function renderOffices() {
  const query = getValue('office-search').toLowerCase();
  officeContainer.innerHTML = '';

  let totalEmployees = 0;
  for (const office of offices) {
    totalEmployees += office.employeeCount;
  }

  const matches = [];
  offices.forEach((office, index) => {
    if (matchesRecord(office, query)) {
      matches.push({ office, index });
    }
  });

  for (const match of matches) {
    const office = match.office;
    const index = match.index;

    const id = office.officeId;
    const name = office.officeName;
    const address = `${office.address}, ${office.city}, ${office.state} ${office.zipCode}`;
    const phone = office.phone;
    const manager = office.manager;
    const employees = office.employeeCount;

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
        <div class="card-actions">
          <button class="edit-btn" onclick="openModal('office', ${index})" aria-label="Edit ${escapeHtml(name)}">Edit</button>
          <button class="delete-btn" onclick="deleteOffice(${index})" aria-label="Delete ${escapeHtml(name)}">Delete</button>
        </div>
      </div>
    `;

    officeContainer.appendChild(cardDiv);
  }

  if (offices.length === 0) {
    officeContainer.innerHTML = '<p class="empty">No offices yet. Use the Add office button to create one.</p>';
  } else if (matches.length === 0) {
    officeContainer.innerHTML = `<p class="empty">No offices match "${escapeHtml(query)}".</p>`;
  }

  document.getElementById('office-count').textContent = offices.length;
  document.getElementById('office-summary').textContent = query
    ? `Showing ${matches.length} of ${offices.length} offices | ${totalEmployees} employees total`
    : `${offices.length} offices | ${totalEmployees} employees total`;
}

// Draw all three lists once when the page loads
renderCustomers();
renderProducts();
renderOffices();

// ============ READ, THE PROJECT 1 WAY ============
// The original project printed formatted reports to the console. Running it
// here against the live arrays shows that every add, edit and delete really
// did land in the data, not just on the screen.

function printConsoleReport() {
  console.log('=== CUSTOMER DATA REPORT ===\n');
  customers.forEach((customer, index) => {
    console.log(`Index:       ${index}`);
    console.log(`Customer ID: ${customer.customerId}`);
    console.log(`Name:        ${customer.firstName} ${customer.lastName}`);
    console.log(`Contact:     ${customer.email} | ${customer.phone}`);
    console.log(`Address:     ${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`);
    console.log(`Status:      ${customer.status}`);
    console.log('--------------------------------------------------');
  });
  console.log(`Total Customers Processed: ${customers.length}\n\n`);

  console.log('=== PRODUCT DATA REPORT ===\n');
  let totalInventoryValue = 0;
  products.forEach((product, index) => {
    totalInventoryValue += product.price * product.stockQuantity;
    console.log(`Index:       ${index}`);
    console.log(`Product ID:  ${product.productId}`);
    console.log(`Name:        ${product.name}`);
    console.log(`Category:    ${product.category} | SKU: ${product.sku}`);
    console.log(`Price:       $${product.price.toFixed(2)}`);
    console.log(`In Stock:    ${product.stockQuantity} units`);
    console.log(`Status:      ${product.status}`);
    console.log('--------------------------------------------------');
  });
  console.log(`Total Products Processed: ${products.length}`);
  console.log(`Total Inventory Value:    $${totalInventoryValue.toFixed(2)}\n\n`);

  console.log('=== OFFICE DATA REPORT ===\n');
  let totalEmployees = 0;
  offices.forEach((office, index) => {
    totalEmployees += office.employeeCount;
    console.log(`Index:       ${index}`);
    console.log(`Office ID:   ${office.officeId}`);
    console.log(`Name:        ${office.officeName}`);
    console.log(`Address:     ${office.address}, ${office.city}, ${office.state} ${office.zipCode}`);
    console.log(`Phone:       ${office.phone}`);
    console.log(`Manager:     ${office.manager}`);
    console.log(`Employees:   ${office.employeeCount}`);
    console.log('--------------------------------------------------');
  });
  console.log(`Total Offices Processed: ${offices.length}`);
  console.log(`Total Employees:         ${totalEmployees}`);
}

// HELPERS

function getValue(inputId) {
  return document.getElementById(inputId).value.trim();
}

function setValue(inputId, value) {
  document.getElementById(inputId).value = value;
}

// The cards are built with innerHTML, so any < or " a user types into a form
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

// Wipe every message so an old Undo button from a different tab can't linger
// and undo the wrong thing.
function clearMessages() {
  for (const message of document.querySelectorAll('.form-message')) {
    message.textContent = '';
    message.className = 'form-message';
  }
}

// Briefly highlight one card: green when it was just created, blue when it was
// just updated.
function highlightCard(container, index, isNew) {
  const card = container.children[index];
  if (!card) {
    return;
  }
  card.classList.add(isNew ? 'just-added' : 'just-updated');
  card.scrollIntoView({ block: 'nearest' });
}

// ============ CREATE and UPDATE: ONE SHARED MODAL ============
//
// openModal('customer')     -> no index, so it opens in CREATE mode
// openModal('customer', 3)  -> an index, so it opens in UPDATE mode
//
// That single difference drives the title, the button label, whether the
// fields start blank or pre-filled, and whether Save pushes or overwrites.

function openModal(type, index = null) {
  currentEditType = type;
  currentEditIndex = index; // null means "creating a new record"

  const config = TYPES[type];

  // One popup serves all three types, so reveal only the matching field group
  for (const group of document.querySelectorAll('.modal-fields')) {
    group.hidden = group.id !== `${type}-fields`;
  }

  if (index === null) {
    // CREATE MODE: start from blank fields
    for (const input of document.querySelectorAll(`#${type}-fields input`)) {
      input.value = '';
    }
    setDefaultStatus(type);

    document.getElementById('modal-title').textContent = config.addTitle;
    document.getElementById('modal-subtitle').innerHTML =
      `The new record will be pushed onto the end of the array, landing at <code>index ${config.list.length}</code>.`;
    document.getElementById('modal-save-btn').textContent = config.addButton;

  } else {
    // UPDATE MODE: copy the record's current values into the fields
    const label = fillEditFields(type, index);

    document.getElementById('modal-title').textContent = config.editTitle;
    document.getElementById('modal-subtitle').innerHTML =
      `Editing <strong>${escapeHtml(label)}</strong>, which lives at <code>index ${index}</code> of the array.`;
    document.getElementById('modal-save-btn').textContent = 'Save changes';
  }

  // Start with a clean message line inside the popup
  const modalMessage = document.getElementById('modal-message');
  modalMessage.textContent = '';
  modalMessage.className = 'form-message';

  // Show the popup and stop the page behind it from scrolling
  document.getElementById('recordModal').hidden = false;
  document.body.classList.add('modal-open');

  const firstInput = document.querySelector(`#${type}-fields input, #${type}-fields select`);
  if (firstInput) {
    firstInput.focus();
  }

  console.log(index === null ? `Adding a new ${type}` : `Editing ${type} at index ${index}`);
}

// Selects keep their options, so give them a sensible starting choice
function setDefaultStatus(type) {
  if (type === 'customer') {
    setValue('formCustomerStatus', 'Active');
  } else if (type === 'product') {
    setValue('formProductStatus', 'In Stock');
  }
}

// Load one record into the popup and return a readable name for the subtitle
function fillEditFields(type, index) {
  if (type === 'customer') {
    const customer = customers[index];
    setValue('formCustomerId', customer.customerId);
    setValue('formCustomerFirstName', customer.firstName);
    setValue('formCustomerLastName', customer.lastName);
    setValue('formCustomerEmail', customer.email);
    setValue('formCustomerPhone', customer.phone);
    setValue('formCustomerAddress', customer.address);
    setValue('formCustomerCity', customer.city);
    setValue('formCustomerState', customer.state);
    setValue('formCustomerZip', customer.zipCode);
    setValue('formCustomerStatus', customer.status);
    return `${customer.firstName} ${customer.lastName}`;
  }

  if (type === 'product') {
    const product = products[index];
    setValue('formProductId', product.productId);
    setValue('formProductName', product.name);
    setValue('formProductCategory', product.category);
    setValue('formProductPrice', product.price);
    setValue('formProductStock', product.stockQuantity);
    setValue('formProductSku', product.sku);
    setValue('formProductStatus', product.status);
    return product.name;
  }

  const office = offices[index];
  setValue('formOfficeId', office.officeId);
  setValue('formOfficeName', office.officeName);
  setValue('formOfficeAddress', office.address);
  setValue('formOfficeCity', office.city);
  setValue('formOfficeState', office.state);
  setValue('formOfficeZip', office.zipCode);
  setValue('formOfficePhone', office.phone);
  setValue('formOfficeManager', office.manager);
  setValue('formOfficeEmployees', office.employeeCount);
  return office.officeName;
}

// Save hands off to the function for whichever type is open. Note the guard is
// on the TYPE, not the index, because a null index is a valid state here: it
// is what tells us this is a create.
function saveRecord() {
  if (currentEditType === null) {
    return;
  }

  if (currentEditType === 'customer') {
    saveCustomer();
  } else if (currentEditType === 'product') {
    saveProduct();
  } else if (currentEditType === 'office') {
    saveOffice();
  }
}

function saveCustomer() {
  const index = currentEditIndex; // null when creating

  const formData = {
    customerId: getValue('formCustomerId'),
    firstName: getValue('formCustomerFirstName'),
    lastName: getValue('formCustomerLastName'),
    email: getValue('formCustomerEmail'),
    phone: getValue('formCustomerPhone'),
    address: getValue('formCustomerAddress'),
    city: getValue('formCustomerCity'),
    state: getValue('formCustomerState').toUpperCase(),
    zipCode: getValue('formCustomerZip'),
    status: getValue('formCustomerStatus')
  };

  if (!formData.customerId || !formData.firstName || !formData.lastName) {
    showMessage('modal-message', 'Customer ID, first name and last name cannot be blank.', true);
    return; // leave the popup open so the mistake can be fixed
  }

  // "i !== index" lets the record being edited keep its own ID while still
  // blocking a clash with anyone else. When creating, index is null, no row
  // matches it, and so every existing ID gets checked.
  const clash = customers.some((customer, i) => i !== index && customer.customerId === formData.customerId);
  if (clash) {
    showMessage('modal-message', `${formData.customerId} is already in use by another customer.`, true);
    return;
  }

  let savedIndex;
  if (index === null) {
    customers.push(formData);          // CREATE
    savedIndex = customers.length - 1;
  } else {
    customers[index] = formData;       // UPDATE
    savedIndex = index;
  }

  finishSave('customer', savedIndex, index === null, `${formData.firstName} ${formData.lastName}`);

  console.log(index === null
    ? `Customer added at index ${savedIndex}. Total customers in array: ${customers.length}`
    : `Customer updated at index ${savedIndex}`);
  console.log(formData);
}

function saveProduct() {
  const index = currentEditIndex;

  const formData = {
    productId: getValue('formProductId'),
    name: getValue('formProductName'),
    category: getValue('formProductCategory'),
    price: parseFloat(getValue('formProductPrice')),   // text box to number
    stockQuantity: parseInt(getValue('formProductStock')),
    sku: getValue('formProductSku'),
    status: getValue('formProductStatus')
  };

  if (!formData.productId || !formData.name) {
    showMessage('modal-message', 'Product ID and name cannot be blank.', true);
    return;
  }

  // parseFloat returns NaN for an empty or non-numeric box, and a NaN price
  // would poison the inventory total and crash toFixed on the card.
  if (Number.isNaN(formData.price) || Number.isNaN(formData.stockQuantity)) {
    showMessage('modal-message', 'Price and units in stock must both be numbers.', true);
    return;
  }

  const clash = products.some((product, i) => i !== index && product.productId === formData.productId);
  if (clash) {
    showMessage('modal-message', `${formData.productId} is already in use by another product.`, true);
    return;
  }

  let savedIndex;
  if (index === null) {
    products.push(formData);
    savedIndex = products.length - 1;
  } else {
    products[index] = formData;
    savedIndex = index;
  }

  finishSave('product', savedIndex, index === null, formData.name);

  console.log(index === null
    ? `Product added at index ${savedIndex}. Total products in array: ${products.length}`
    : `Product updated at index ${savedIndex}`);
  console.log(formData);
}

function saveOffice() {
  const index = currentEditIndex;

  const formData = {
    officeId: getValue('formOfficeId'),
    officeName: getValue('formOfficeName'),
    address: getValue('formOfficeAddress'),
    city: getValue('formOfficeCity'),
    state: getValue('formOfficeState').toUpperCase(),
    zipCode: getValue('formOfficeZip'),
    phone: getValue('formOfficePhone'),
    manager: getValue('formOfficeManager'),
    employeeCount: parseInt(getValue('formOfficeEmployees'))
  };

  if (!formData.officeId || !formData.officeName) {
    showMessage('modal-message', 'Office ID and name cannot be blank.', true);
    return;
  }

  if (Number.isNaN(formData.employeeCount)) {
    showMessage('modal-message', 'Employees must be a number.', true);
    return;
  }

  const clash = offices.some((office, i) => i !== index && office.officeId === formData.officeId);
  if (clash) {
    showMessage('modal-message', `${formData.officeId} is already in use by another office.`, true);
    return;
  }

  let savedIndex;
  if (index === null) {
    offices.push(formData);
    savedIndex = offices.length - 1;
  } else {
    offices[index] = formData;
    savedIndex = index;
  }

  finishSave('office', savedIndex, index === null, formData.officeName);

  console.log(index === null
    ? `Office added at index ${savedIndex}. Total offices in array: ${offices.length}`
    : `Office updated at index ${savedIndex}`);
  console.log(formData);
}

// Shared cleanup after any successful save
function finishSave(type, savedIndex, wasCreate, label) {
  const config = TYPES[type];

  closeModal();

  // Clear the search box. Without this, saving a record that doesn't match the
  // current filter would look like nothing happened, because the card it just
  // wrote would be filtered straight back out of view.
  setValue(config.searchId, '');

  config.render();
  highlightCard(config.container, savedIndex, wasCreate);

  clearMessages();
  showMessage(config.messageId, `${wasCreate ? 'Added' : 'Updated'} ${label}.`, false);
}

// ============ CANCEL ============
// Closing never touches the arrays, so the record keeps whatever it had.
function closeModal() {
  document.getElementById('recordModal').hidden = true;
  document.body.classList.remove('modal-open');
  currentEditType = null;
  currentEditIndex = null;
}

// Clicking the dark area outside the popup also cancels. The check matters:
// without it, a click on the white panel would bubble up and close the popup.
function handleBackdropClick(event) {
  if (event.target.id === 'recordModal') {
    closeModal();
  }
}

// The Escape key cancels too, which is what people expect from a popup
document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' && document.getElementById('recordModal').hidden === false) {
    closeModal();
  }
});

// ============ DELETE ============
//
// Every Delete button was rendered with its own array index baked in.
// splice(index, 1) removes one record and RETURNS what it pulled out, which is
// how we keep a copy for the Undo button.

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
