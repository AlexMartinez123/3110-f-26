import { ComponentFixture, TestBed } from '@angular/core/testing';
import { P6Crud } from './p6-crud';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';

describe('P6Crud', () => {
  let component: P6Crud;
  let fixture: ComponentFixture<P6Crud>;
  let customerService: CustomerService;
  let productService: ProductService;

  const cards = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.card')) as HTMLElement[];
  const names = () => cards().map(c => c.querySelector('h4')?.textContent?.trim());
  const chips = () => cards().map(c => c.querySelector('.index-chip')?.textContent?.trim());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P6Crud],
    }).compileComponents();

    fixture = TestBed.createComponent(P6Crud);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService);
    productService = TestBed.inject(ProductService);
    await fixture.whenStable();
  });

  it('renders every customer with the popup shut', () => {
    expect(cards().length).toBe(6);
    expect(component.isOpen()).toBe(false);
  });

  // ---- CREATE ----

  it('openCreate puts the popup in CREATE mode with a blank draft', async () => {
    component.openCreate('customers');
    await fixture.whenStable();

    expect(component.isOpen()).toBe(true);
    expect(component.modalIndex()).toBeNull();   // null IS the create flag
    expect(component.isCreating()).toBe(true);
    expect(component.customerDraft.customerId).toBe('');
    expect(component.modalTitle()).toBe('Add a customer');
    expect(component.nextIndex()).toBe(6);
  });

  it('saving in create mode appends to the end', async () => {
    component.openCreate('customers');
    await fixture.whenStable();

    component.customerDraft.customerId = 'CUST-107';
    component.customerDraft.firstName = 'Dana';
    component.customerDraft.lastName = 'Whitfield';
    component.customerDraft.state = 'az';
    component.saveRecord();
    await fixture.whenStable();

    const list = customerService.customers();
    expect(list.length).toBe(7);
    expect(list[6].customerId).toBe('CUST-107');
    expect(list[6].state).toBe('AZ');            // upper-cased on save
    expect(component.isOpen()).toBe(false);
  });

  it('cancelling a create adds nothing', async () => {
    component.openCreate('customers');
    await fixture.whenStable();
    component.customerDraft.customerId = 'CUST-999';
    component.customerDraft.firstName = 'Ghost';
    component.closeModal();
    await fixture.whenStable();

    expect(customerService.customers().length).toBe(6);
    expect(customerService.customers().some(c => c.customerId === 'CUST-999')).toBe(false);
  });

  // ---- UPDATE, same popup ----

  it('openEdit puts the SAME popup in UPDATE mode, pre-filled', async () => {
    component.openEdit('customers', 2);
    await fixture.whenStable();

    expect(component.isCreating()).toBe(false);
    expect(component.modalIndex()).toBe(2);
    expect(component.customerDraft.firstName).toBe('Jordan');
    expect(component.modalTitle()).toBe('Edit customer');
  });

  it('saving in edit mode replaces in place', async () => {
    component.openEdit('customers', 2);
    await fixture.whenStable();

    component.customerDraft.firstName = 'Jordy';
    component.saveRecord();
    await fixture.whenStable();

    expect(customerService.customers().length).toBe(6);  // not appended
    expect(customerService.customers()[2].firstName).toBe('Jordy');
  });

  it('cancelling an edit changes nothing', async () => {
    const before = JSON.stringify(customerService.customers()[0]);

    component.openEdit('customers', 0);
    await fixture.whenStable();
    component.customerDraft.firstName = 'WIPED';
    component.closeModal();
    await fixture.whenStable();

    expect(JSON.stringify(customerService.customers()[0])).toBe(before);
  });

  it('duplicate ids are refused on create, and own ids allowed on edit', async () => {
    component.openCreate('customers');
    await fixture.whenStable();
    component.customerDraft.customerId = 'CUST-101';
    component.customerDraft.firstName = 'Dupe';
    component.customerDraft.lastName = 'Test';
    component.saveRecord();
    await fixture.whenStable();

    expect(customerService.customers().length).toBe(6);
    expect(component.isOpen()).toBe(true);
    expect(component.modalMessage()).toContain('already in use');

    component.closeModal();
    component.openEdit('customers', 0);
    await fixture.whenStable();
    component.customerDraft.lastName = 'Leeson';   // keeps CUST-101
    component.saveRecord();
    await fixture.whenStable();

    expect(customerService.customers()[0].lastName).toBe('Leeson');
  });

  // ---- READ: search, and the index trap ----

  it('*** a filtered row carries its TRUE array index, not its row number ***', async () => {
    component.customerSearch.set('seattle');       // only Olivia, at index 5
    await fixture.whenStable();

    expect(cards().length).toBe(1);
    expect(names()).toEqual(['Olivia Nguyen']);
    expect(chips()).toEqual(['index 5']);          // not "index 0"
    expect(component.filteredCustomers()[0].index).toBe(5);
  });

  it('editing a filtered row hits the right record', async () => {
    component.customerSearch.set('seattle');
    await fixture.whenStable();

    const entry = component.filteredCustomers()[0];
    component.openEdit('customers', entry.index);
    await fixture.whenStable();

    expect(component.customerDraft.firstName).toBe('Olivia');

    component.customerDraft.phone = '555-9999';
    component.saveRecord();
    await fixture.whenStable();

    expect(customerService.customers()[5].phone).toBe('555-9999');
    expect(customerService.customers()[0].firstName).toBe('Marcus'); // index 0 safe
  });

  it('deleting a filtered row removes the right record', async () => {
    component.customerSearch.set('boston');        // Hannah Kim, index 3
    await fixture.whenStable();

    expect(component.filteredCustomers()[0].index).toBe(3);
    component.deleteCustomer(component.filteredCustomers()[0].index);
    await fixture.whenStable();

    expect(customerService.customers().length).toBe(5);
    expect(customerService.customers().some(c => c.firstName === 'Hannah')).toBe(false);
    expect(customerService.customers()[0].firstName).toBe('Marcus');
  });

  it('saving clears the search so the saved row is actually visible', async () => {
    component.customerSearch.set('seattle');
    await fixture.whenStable();

    component.openCreate('customers');
    component.customerDraft.customerId = 'CUST-200';
    component.customerDraft.firstName = 'Nina';
    component.customerDraft.lastName = 'Alvarez';
    component.saveRecord();
    await fixture.whenStable();

    expect(component.customerSearch()).toBe('');
    expect(cards().length).toBe(7);
  });

  it('a search with no hits says so without emptying the data', async () => {
    component.customerSearch.set('zzzzz');
    await fixture.whenStable();

    expect(component.filteredCustomers().length).toBe(0);
    expect(customerService.customers().length).toBe(6);
    expect(fixture.nativeElement.textContent).toContain('No customers match');
  });

  // ---- DELETE and UNDO ----

  it('undo puts a deleted record back in its slot', async () => {
    component.deleteCustomer(1);
    await fixture.whenStable();
    expect(customerService.customers().length).toBe(5);

    component.undoDelete();
    await fixture.whenStable();

    expect(customerService.customers().length).toBe(6);
    expect(customerService.customers()[1].customerId).toBe('CUST-102');
  });

  it('undo with nothing pending is a safe no-op', async () => {
    component.undoDelete();
    await fixture.whenStable();
    expect(customerService.customers().length).toBe(6);
  });

  it('undo reaches the right service when the delete was a product', async () => {
    component.showTab('products');
    component.deleteProduct(0);
    await fixture.whenStable();
    expect(productService.products().length).toBe(5);

    component.undoDelete();
    await fixture.whenStable();

    expect(productService.products().length).toBe(6);
    expect(productService.products()[0].productId).toBe('PROD-001');
    expect(customerService.customers().length).toBe(6); // customers untouched
  });

  // ---- misc ----

  it('saveRecord with nothing open is a safe no-op', async () => {
    const before = JSON.stringify(customerService.customers());
    component.saveRecord();
    await fixture.whenStable();
    expect(JSON.stringify(customerService.customers())).toBe(before);
  });

  it('product numbers survive a create as real numbers', async () => {
    component.showTab('products');
    component.openCreate('products');
    await fixture.whenStable();

    component.productDraft.productId = 'PROD-007';
    component.productDraft.name = 'Laptop Stand';
    component.productDraft.price = 34.99;
    component.productDraft.stockQuantity = 60;
    component.saveRecord();
    await fixture.whenStable();

    const created = productService.products()[6];
    expect(typeof created.price).toBe('number');
    expect(created.price.toFixed(2)).toBe('34.99');
  });
});
