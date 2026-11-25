import { ComponentFixture, TestBed } from '@angular/core/testing';
import { P5Modal } from './p5-modal';
import { CustomerService } from '../services/customer';
import { ProductService } from '../services/product';

describe('P5Modal', () => {
  let component: P5Modal;
  let fixture: ComponentFixture<P5Modal>;
  let customerService: CustomerService;
  let productService: ProductService;

  const modalEl = () => fixture.nativeElement.querySelector('.modal');

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P5Modal],
    }).compileComponents();

    fixture = TestBed.createComponent(P5Modal);
    component = fixture.componentInstance;
    customerService = TestBed.inject(CustomerService);
    productService = TestBed.inject(ProductService);
    await fixture.whenStable();
  });

  it('starts with the popup shut and nothing in the DOM for it', () => {
    expect(component.isOpen()).toBe(false);
    expect(modalEl()).toBeNull();
  });

  it('opening fills the draft from the record and reveals the popup', async () => {
    component.openEdit('customers', 2); // Jordan Rivera
    await fixture.whenStable();

    expect(component.isOpen()).toBe(true);
    expect(component.editIndex()).toBe(2);
    expect(component.customerDraft.firstName).toBe('Jordan');
    expect(component.customerDraft.customerId).toBe('CUST-103');
    expect(modalEl()).not.toBeNull();
  });

  it('the draft is a COPY: typing in it does not reach the service', async () => {
    component.openEdit('customers', 2);
    await fixture.whenStable();

    component.customerDraft.firstName = 'Typed';

    expect(customerService.customers()[2].firstName).toBe('Jordan');
  });

  it('saving writes the draft back into the same slot', async () => {
    component.openEdit('customers', 2);
    await fixture.whenStable();

    component.customerDraft.firstName = 'Jordy';
    component.customerDraft.city = 'Boulder';
    component.saveEdit();
    await fixture.whenStable();

    const list = customerService.customers();
    expect(list.length).toBe(6);                      // replaced, not appended
    expect(list[2].firstName).toBe('Jordy');
    expect(list[2].city).toBe('Boulder');
    expect(list[2].email).toBe('jrivera@example.com'); // untouched field kept
    expect(list[1].firstName).toBe('Priya');           // neighbours untouched
    expect(list[3].firstName).toBe('Hannah');
    expect(component.isOpen()).toBe(false);
  });

  it('*** CANCEL leaves the record exactly as it was ***', async () => {
    const before = JSON.stringify(customerService.customers()[0]);

    component.openEdit('customers', 0);
    await fixture.whenStable();
    component.customerDraft.firstName = 'WIPED';
    component.customerDraft.email = 'nope@example.com';
    component.closeModal();
    await fixture.whenStable();

    expect(JSON.stringify(customerService.customers()[0])).toBe(before);
    expect(component.isOpen()).toBe(false);
    expect(modalEl()).toBeNull();
  });

  it('refuses an id that belongs to someone else, and stays open', async () => {
    component.openEdit('customers', 0);
    await fixture.whenStable();

    component.customerDraft.customerId = 'CUST-104'; // owned by index 3
    component.saveEdit();
    await fixture.whenStable();

    expect(customerService.customers()[0].customerId).toBe('CUST-101');
    expect(component.isOpen()).toBe(true);
    expect(component.modalMessage()).toContain('already belongs');
  });

  it('lets a record keep its OWN id', async () => {
    component.openEdit('customers', 0);
    await fixture.whenStable();

    component.customerDraft.lastName = 'Leeson'; // id left alone
    component.saveEdit();
    await fixture.whenStable();

    expect(customerService.customers()[0].lastName).toBe('Leeson');
    expect(component.isOpen()).toBe(false);
  });

  it('blocks a blank required field', async () => {
    component.openEdit('customers', 0);
    await fixture.whenStable();

    component.customerDraft.firstName = '   ';
    component.saveEdit();
    await fixture.whenStable();

    expect(customerService.customers()[0].firstName).toBe('Marcus');
    expect(component.isOpen()).toBe(true);
  });

  it('product numbers stay numbers, and the computed total follows', async () => {
    component.openEdit('products', 0); // Wireless Mouse, 24.99 x 150
    await fixture.whenStable();

    component.productDraft.price = 19.5;
    component.productDraft.stockQuantity = 7;
    component.saveEdit();
    await fixture.whenStable();

    const product = productService.products()[0];
    expect(typeof product.price).toBe('number');
    expect(product.price).toBe(19.5);
    expect(product.price.toFixed(2)).toBe('19.50');
    expect(productService.totalInventoryValue())
      .toBeCloseTo(23702.58 - 24.99 * 150 + 19.5 * 7, 2);
  });

  it('a blank number is refused rather than saved as null', async () => {
    component.openEdit('products', 0);
    await fixture.whenStable();

    component.productDraft.price = null; // what a cleared number box gives
    component.saveEdit();
    await fixture.whenStable();

    expect(productService.products()[0].price).toBe(24.99);
    expect(component.isOpen()).toBe(true);
  });

  it('Escape closes the popup without saving', async () => {
    component.openEdit('customers', 0);
    await fixture.whenStable();
    component.customerDraft.firstName = 'Nope';

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(component.isOpen()).toBe(false);
    expect(customerService.customers()[0].firstName).toBe('Marcus');
  });

  it('a click inside the panel does not close it, the backdrop does', async () => {
    component.openEdit('customers', 0);
    await fixture.whenStable();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop') as HTMLElement;
    const panel = fixture.nativeElement.querySelector('.modal') as HTMLElement;

    panel.click();                 // bubbles to the backdrop handler
    await fixture.whenStable();
    expect(component.isOpen()).toBe(true);

    backdrop.click();              // the dark area itself
    await fixture.whenStable();
    expect(component.isOpen()).toBe(false);
  });

  it('clicking an Edit button in the template opens that record', async () => {
    const buttons = fixture.nativeElement.querySelectorAll('.edit-btn') as NodeListOf<HTMLButtonElement>;
    buttons[1].click();
    await fixture.whenStable();

    expect(component.isOpen()).toBe(true);
    expect(component.editIndex()).toBe(1);
    expect(component.customerDraft.firstName).toBe('Priya');
  });
});
