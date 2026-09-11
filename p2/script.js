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

// "Ingest" each JSON document by parsing the raw strings into JavaScript objects
const customers = JSON.parse(rawCustomersJson);
const products = JSON.parse(rawProductsJson);
const offices = JSON.parse(rawOfficesJson);

// Find the container elements in the HTML document
const customerContainer = document.getElementById('customer-container');
const productContainer = document.getElementById('product-container');
const officeContainer = document.getElementById('office-container');

// ITERATE THE CUSTOMERS TABLE

console.log('=== CUSTOMER DATA REPORT ===\n\n');

for (const customer of customers) {
  // Variables to hold the marshalled contents
  const id = customer.customerId;
  const fullName = `${customer.firstName} ${customer.lastName}`;
  const email = customer.email;
  const phone = customer.phone;
  const address = `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`;
  const status = customer.status;

  // Console printing (from Project 1)
  console.log(`Customer ID: ${id}`);
  console.log(`Name:        ${fullName}`);
  console.log(`Contact:     ${email} | ${phone}`);
  console.log(`Address:     ${address}`);
  console.log(`Status:      ${status}`);
  console.log('--------------------------------------------------');

  // HTML printing: create a div for this customer
  const cardDiv = document.createElement('div');
  cardDiv.className = 'customer-card';

  const statusClass = `status-${status.toLowerCase()}`;

  cardDiv.innerHTML = `
    <h2>${fullName} <span>(#${id})</span></h2>
    <p><strong>Contact:</strong> ${email} | ${phone}</p>
    <p><strong>Address:</strong> ${address}</p>
    <span class="status ${statusClass}">${status}</span>
  `;

  // Clicking a card selects or deselects it
  cardDiv.addEventListener('click', () => {
    const isSelected = cardDiv.classList.toggle('selected');
    console.log(`${isSelected ? 'Selected' : 'Deselected'} customer: ${fullName} (#${id})`);
  });

  customerContainer.appendChild(cardDiv);
}

console.log(`\nTotal Customers Processed: ${customers.length}\n\n`);
document.getElementById('customer-summary').textContent =
  `Total Customers Processed: ${customers.length}`;

// ITERATE THE PRODUCTS TABLE

console.log('=== PRODUCT DATA REPORT ===\n\n');

let totalInventoryValue = 0;

for (const product of products) {
  // Variables to hold the marshalled contents
  const id = product.productId;
  const name = product.name;
  const category = product.category;
  const price = `$${product.price.toFixed(2)}`;
  const stock = product.stockQuantity;
  const sku = product.sku;
  const status = product.status;

  totalInventoryValue += product.price * product.stockQuantity;

  // Console printing (from Project 1)
  console.log(`Product ID:  ${id}`);
  console.log(`Name:        ${name}`);
  console.log(`Category:    ${category} | SKU: ${sku}`);
  console.log(`Price:       ${price}`);
  console.log(`In Stock:    ${stock} units`);
  console.log(`Status:      ${status}`);
  console.log('--------------------------------------------------');

  // HTML printing: create a div for this product
  const cardDiv = document.createElement('div');
  cardDiv.className = 'product-card';

  // "In Stock" becomes "status-in-stock" so it works as a CSS class
  const statusClass = `status-${status.toLowerCase().replaceAll(' ', '-')}`;

  cardDiv.innerHTML = `
    <h2>${name} <span>(#${id})</span></h2>
    <p><strong>Category:</strong> ${category} | SKU: ${sku}</p>
    <p><strong>Price:</strong> ${price}</p>
    <p><strong>In Stock:</strong> ${stock} units</p>
    <span class="status ${statusClass}">${status}</span>
  `;

  cardDiv.addEventListener('click', () => {
    const isSelected = cardDiv.classList.toggle('selected');
    console.log(`${isSelected ? 'Selected' : 'Deselected'} product: ${name} (#${id})`);
  });

  productContainer.appendChild(cardDiv);
}

console.log(`\nTotal Products Processed: ${products.length}`);
console.log(`Total Inventory Value:    $${totalInventoryValue.toFixed(2)}\n\n`);
document.getElementById('product-summary').textContent =
  `Total Products Processed: ${products.length} | Total Inventory Value: $${totalInventoryValue.toFixed(2)}`;

// ITERATE THE OFFICES TABLE

console.log('=== OFFICE DATA REPORT ===\n\n');

let totalEmployees = 0;

for (const office of offices) {
  // Variables to hold the marshalled contents
  const id = office.officeId;
  const name = office.officeName;
  const address = `${office.address}, ${office.city}, ${office.state} ${office.zipCode}`;
  const phone = office.phone;
  const manager = office.manager;
  const employees = office.employeeCount;

  totalEmployees += employees;

  // Console printing (from Project 1)
  console.log(`Office ID:   ${id}`);
  console.log(`Name:        ${name}`);
  console.log(`Address:     ${address}`);
  console.log(`Phone:       ${phone}`);
  console.log(`Manager:     ${manager}`);
  console.log(`Employees:   ${employees}`);
  console.log('--------------------------------------------------');

  // HTML printing: create a div for this office
  const cardDiv = document.createElement('div');
  cardDiv.className = 'office-card';

  cardDiv.innerHTML = `
    <h2>${name} <span>(#${id})</span></h2>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Manager:</strong> ${manager}</p>
    <span class="status status-info">${employees} employees</span>
  `;

  cardDiv.addEventListener('click', () => {
    const isSelected = cardDiv.classList.toggle('selected');
    console.log(`${isSelected ? 'Selected' : 'Deselected'} office: ${name} (#${id})`);
  });

  officeContainer.appendChild(cardDiv);
}

console.log(`\nTotal Offices Processed: ${offices.length}`);
console.log(`Total Employees:         ${totalEmployees}`);
document.getElementById('office-summary').textContent =
  `Total Offices Processed: ${offices.length} | Total Employees: ${totalEmployees}`;
