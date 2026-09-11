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
// const still works here because we push to the arrays, we never reassign them.
const customers = JSON.parse(rawCustomersJson);
const products = JSON.parse(rawProductsJson);
const offices = JSON.parse(rawOfficesJson);

// Find the containers where the records are displayed
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
// Each function clears its container and rebuilds the list from the array,
// so we can call it again any time the array changes.

function renderCustomers() {
  customerContainer.innerHTML = '';

  for (const customer of customers) {
    const id = customer.customerId;
    const fullName = `${customer.firstName} ${customer.lastName}`;
    const email = customer.email;
    const phone = customer.phone;
    const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
    const status = customer.status;

    const recordDiv = document.createElement('div');
    recordDiv.className = `record status-${status.toLowerCase()}`;

    recordDiv.innerHTML = `
      <div>
        <h3>${fullName}</h3>
        <p class="record-id">${id}</p>
      </div>
      <div class="record-details">
        <p>${email}</p>
        <p>${phone}</p>
        <p>${address}</p>
      </div>
      <span class="status">${status}</span>
    `;

    customerContainer.appendChild(recordDiv);
  }

  document.getElementById('customer-count').textContent = customers.length;
  document.getElementById('customer-summary').textContent =
    `${customers.length} customers on file`;
}

function renderProducts() {
  productContainer.innerHTML = '';

  let totalInventoryValue = 0;

  for (const product of products) {
    const id = product.productId;
    const name = product.name;
    const category = product.category;
    const price = `$${product.price.toFixed(2)}`;
    const stock = product.stockQuantity;
    const sku = product.sku;
    const status = product.status;

    totalInventoryValue += product.price * product.stockQuantity;

    const recordDiv = document.createElement('div');
    // "In Stock" becomes "status-in-stock" so it works as a CSS class
    recordDiv.className = `record status-${status.toLowerCase().replaceAll(' ', '-')}`;

    recordDiv.innerHTML = `
      <div>
        <h3>${name}</h3>
        <p class="record-id">${id}</p>
      </div>
      <div class="record-details">
        <p>${category} | SKU ${sku}</p>
        <p>${price} each</p>
        <p>${stock} units in stock</p>
      </div>
      <span class="status">${status}</span>
    `;

    productContainer.appendChild(recordDiv);
  }

  document.getElementById('product-count').textContent = products.length;
  document.getElementById('product-summary').textContent =
    `${products.length} products | $${totalInventoryValue.toFixed(2)} total inventory value`;
}

function renderOffices() {
  officeContainer.innerHTML = '';

  let totalEmployees = 0;

  for (const office of offices) {
    const id = office.officeId;
    const name = office.officeName;
    const address = `${office.address}, ${office.city}, ${office.state} ${office.zipCode}`;
    const phone = office.phone;
    const manager = office.manager;
    const employees = office.employeeCount;

    totalEmployees += employees;

    const recordDiv = document.createElement('div');
    recordDiv.className = 'record office';

    recordDiv.innerHTML = `
      <div>
        <h3>${name}</h3>
        <p class="record-id">${id}</p>
      </div>
      <div class="record-details">
        <p>${address}</p>
        <p>${phone}</p>
        <p>Managed by ${manager}</p>
      </div>
      <span class="status">${employees} employees</span>
    `;

    officeContainer.appendChild(recordDiv);
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

function showMessage(messageId, text, isError) {
  const message = document.getElementById(messageId);
  message.textContent = text;
  message.className = isError ? 'form-message error' : 'form-message success';
}

// Briefly highlight the newest record so it's easy to see what changed
function highlightNewest(container) {
  const newest = container.lastElementChild;
  newest.classList.add('just-added');
  newest.scrollIntoView({ block: 'nearest' });
}

// ADD FUNCTIONS
// Each one runs when its form is submitted. It reads the inputs, checks the
// array for a duplicate ID, pushes the new object, and re-renders the list.

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
