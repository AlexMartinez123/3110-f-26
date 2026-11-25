import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';
import { OfficeService } from '../services/office';

@Component({
  selector: 'app-p1-console',
  // Standalone components declare what their template uses. The currency pipe
  // has to be imported here before {{ value | currency }} will compile.
  imports: [CurrencyPipe],
  templateUrl: './p1-console.html',
  styleUrl: './p1-console.css',
})
export class P1Console implements OnInit {
  // 1. Inject the three shared services
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private officeService = inject(OfficeService);

  // 2. Expose the read-only Signals so the template can show live counts
  customers = this.customerService.customers;
  products = this.productService.products;
  offices = this.officeService.offices;
  totalInventoryValue = this.productService.totalInventoryValue;
  totalEmployees = this.officeService.totalEmployees;

  // 3. ngOnInit replaces the top-to-bottom script execution of p1/script.js.
  //    Angular calls it once, after the component has been set up.
  ngOnInit(): void {
    this.printAllReports();
  }

  // 4. The three reports from project 1, reading whatever the services hold now
  printAllReports(): void {
    this.printCustomerReport();
    this.printProductReport();
    this.printOfficeReport();
  }

  printCustomerReport(): void {
    console.log('=== CUSTOMER DATA REPORT (Angular P1 Component) ===\n\n');

    for (const customer of this.customers()) {
      console.log(`Customer ID: ${customer.customerId}`);
      console.log(`Name:        ${customer.firstName} ${customer.lastName}`);
      console.log(`Contact:     ${customer.email} | ${customer.phone}`);
      console.log(`Address:     ${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`);
      console.log(`Status:      ${customer.status}`);
      console.log('--------------------------------------------------');
    }

    console.log(`\nTotal Customers Processed: ${this.customers().length}\n\n`);
  }

  printProductReport(): void {
    console.log('=== PRODUCT DATA REPORT (Angular P1 Component) ===\n\n');

    for (const product of this.products()) {
      console.log(`Product ID:  ${product.productId}`);
      console.log(`Name:        ${product.name}`);
      console.log(`Category:    ${product.category} | SKU: ${product.sku}`);
      console.log(`Price:       $${product.price.toFixed(2)}`);
      console.log(`In Stock:    ${product.stockQuantity} units`);
      console.log(`Status:      ${product.status}`);
      console.log('--------------------------------------------------');
    }

    console.log(`\nTotal Products Processed: ${this.products().length}`);
    // The running total is a computed Signal now, not a `let` we add to in the loop
    console.log(`Total Inventory Value:    $${this.totalInventoryValue().toFixed(2)}\n\n`);
  }

  printOfficeReport(): void {
    console.log('=== OFFICE DATA REPORT (Angular P1 Component) ===\n\n');

    for (const office of this.offices()) {
      console.log(`Office ID:   ${office.officeId}`);
      console.log(`Name:        ${office.officeName}`);
      console.log(`Address:     ${office.address}, ${office.city}, ${office.state} ${office.zipCode}`);
      console.log(`Phone:       ${office.phone}`);
      console.log(`Manager:     ${office.manager}`);
      console.log(`Employees:   ${office.employeeCount}`);
      console.log('--------------------------------------------------');
    }

    console.log(`\nTotal Offices Processed: ${this.offices().length}`);
    console.log(`Total Employees:         ${this.totalEmployees()}`);
  }
}
