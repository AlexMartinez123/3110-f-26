import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../models/customer';
import { Product } from '../models/product';
import { Office } from '../models/office';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';
import { OfficeService } from '../services/office';

// The form holds a DRAFT, not a finished record. A number input that the user
// clears hands back null, which a `number` field is not allowed to be, so the
// draft types say so honestly and the add methods convert once validated.
interface ProductDraft {
  productId: string;
  name: string;
  category: string;
  price: number | null;
  stockQuantity: number | null;
  sku: string;
  status: Product['status'];
}

interface OfficeDraft {
  officeId: string;
  officeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  manager: string;
  employeeCount: number | null;
}

type TabName = 'customers' | 'products' | 'offices';

@Component({
  selector: 'app-p3-form',
  // FormsModule is what unlocks [(ngModel)] two-way binding in a standalone component
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './p3-form.html',
  styleUrl: './p3-form.css',
})
export class P3Form {
  private customerService = inject(CustomerService);
  private productService = inject(ProductService);
  private officeService = inject(OfficeService);

  customers = this.customerService.customers;
  products = this.productService.products;
  offices = this.officeService.offices;
  totalInventoryValue = this.productService.totalInventoryValue;
  totalEmployees = this.officeService.totalEmployees;

  // Which tab is showing. A Signal, so the template re-renders on change.
  activeTab = signal<TabName>('customers');

  // One message line, shown under whichever form is open
  message = signal<{ text: string; isError: boolean } | null>(null);

  // Form state objects, replacing ten separate getElementById().value reads
  newCustomer: Customer = this.emptyCustomer();
  newProduct: ProductDraft = this.emptyProduct();
  newOffice: OfficeDraft = this.emptyOffice();

  showTab(tab: TabName): void {
    this.activeTab.set(tab);
    this.message.set(null);
  }

  // ---- CREATE ----

  addCustomer(): void {
    const draft = this.newCustomer;

    if (!draft.customerId.trim() || !draft.firstName.trim() || !draft.lastName.trim()) {
      this.message.set({ text: 'Customer ID, first name and last name cannot be blank.', isError: true });
      return;
    }

    if (this.customerService.isDuplicateId(draft.customerId.trim())) {
      this.message.set({ text: `${draft.customerId} is already in use.`, isError: true });
      return;
    }

    this.customerService.addCustomer({
      ...draft,
      customerId: draft.customerId.trim(),
      firstName: draft.firstName.trim(),
      lastName: draft.lastName.trim(),
      state: draft.state.trim().toUpperCase()
    });

    this.message.set({ text: `Added ${draft.firstName} ${draft.lastName}.`, isError: false });
    this.newCustomer = this.emptyCustomer();

    console.log(`Customer added via CustomerService. Total is now ${this.customers().length}`);
  }

  addProduct(): void {
    const draft = this.newProduct;

    if (!draft.productId.trim() || !draft.name.trim()) {
      this.message.set({ text: 'Product ID and name cannot be blank.', isError: true });
      return;
    }

    // null when the box was left empty, so check before trusting the numbers
    if (draft.price === null || draft.stockQuantity === null) {
      this.message.set({ text: 'Price and units in stock must both be filled in.', isError: true });
      return;
    }

    if (this.productService.isDuplicateId(draft.productId.trim())) {
      this.message.set({ text: `${draft.productId} is already in use.`, isError: true });
      return;
    }

    const product: Product = {
      productId: draft.productId.trim(),
      name: draft.name.trim(),
      category: draft.category.trim(),
      price: draft.price,
      stockQuantity: draft.stockQuantity,
      sku: draft.sku.trim(),
      status: draft.status
    };

    this.productService.addProduct(product);
    this.message.set({ text: `Added ${product.name}.`, isError: false });
    this.newProduct = this.emptyProduct();

    console.log(`Product added. Total is now ${this.products().length}`);
  }

  addOffice(): void {
    const draft = this.newOffice;

    if (!draft.officeId.trim() || !draft.officeName.trim()) {
      this.message.set({ text: 'Office ID and name cannot be blank.', isError: true });
      return;
    }

    if (draft.employeeCount === null) {
      this.message.set({ text: 'Employees must be filled in.', isError: true });
      return;
    }

    if (this.officeService.isDuplicateId(draft.officeId.trim())) {
      this.message.set({ text: `${draft.officeId} is already in use.`, isError: true });
      return;
    }

    const office: Office = {
      officeId: draft.officeId.trim(),
      officeName: draft.officeName.trim(),
      address: draft.address.trim(),
      city: draft.city.trim(),
      state: draft.state.trim().toUpperCase(),
      zipCode: draft.zipCode.trim(),
      phone: draft.phone.trim(),
      manager: draft.manager.trim(),
      employeeCount: draft.employeeCount
    };

    this.officeService.addOffice(office);
    this.message.set({ text: `Added ${office.officeName}.`, isError: false });
    this.newOffice = this.emptyOffice();

    console.log(`Office added. Total is now ${this.offices().length}`);
  }

  statusClass(status: string): string {
    return 'status-' + status.toLowerCase().split(' ').join('-');
  }

  // ---- blank forms ----

  private emptyCustomer(): Customer {
    return {
      customerId: '', firstName: '', lastName: '', email: '', phone: '',
      address: '', city: '', state: '', zipCode: '', status: 'Active'
    };
  }

  private emptyProduct(): ProductDraft {
    return {
      productId: '', name: '', category: '', price: null,
      stockQuantity: null, sku: '', status: 'In Stock'
    };
  }

  private emptyOffice(): OfficeDraft {
    return {
      officeId: '', officeName: '', address: '', city: '', state: '',
      zipCode: '', phone: '', manager: '', employeeCount: null
    };
  }
}
