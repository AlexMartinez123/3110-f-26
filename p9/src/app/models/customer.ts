// The strict shape every customer record must take. Migrated from the raw JSON
// string that p1-p4 parsed at runtime: TypeScript now checks the shape at
// compile time instead of us hoping it is right.
export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'Active' | 'Inactive' | 'Pending'; // union type limits the possibilities
}
