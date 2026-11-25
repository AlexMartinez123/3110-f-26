import { Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';
import { OfficeService } from '../services/office';

@Component({
  selector: 'app-p2-dom',
  imports: [CurrencyPipe],
  templateUrl: './p2-dom.html',
  styleUrl: './p2-dom.css',
})
export class P2Dom implements OnInit {
  // The same three services P1Console used. Angular hands every component the
  // one shared instance, so all four projects on this page see one dataset.
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private officeService = inject(OfficeService);

  customers = this.customerService.customers;
  products = this.productService.products;
  offices = this.officeService.offices;
  totalInventoryValue = this.productService.totalInventoryValue;
  totalEmployees = this.officeService.totalEmployees;

  ngOnInit(): void {
    console.log(
      `=== P2 DOM COMPONENT === rendered ${this.customers().length} customers, ` +
      `${this.products().length} products and ${this.offices().length} offices ` +
      `without a single document.createElement call.`
    );
  }

  // "In Stock" becomes "status-in-stock" so it works as a CSS class. Keeping it
  // in the component rather than the template keeps the markup readable.
  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().split(' ').join('-');
  }
}
