# Next.js Integration Example

This folder contains example code for integrating your Next.js application with the headless ERPNext backend.

## Setup

1. **Install dependencies in your Next.js project:**
   ```bash
   npm install axios swr js-cookie socket.io-client
   npm install -D @types/js-cookie
   ```

2. **Set up environment variables** in `.env.local`:
   ```env
   NEXT_PUBLIC_ERPNEXT_URL=http://localhost:8080
   NEXT_PUBLIC_ERPNEXT_API_KEY=your_api_key
   NEXT_PUBLIC_ERPNEXT_API_SECRET=your_api_secret
   ```

3. **Copy the example files** to your Next.js project:
   - `lib/erpnext-client.ts` - API client
   - `hooks/useERPNext.ts` - React hooks
   - `contexts/AuthContext.tsx` - Authentication context

## Usage Examples

### Fetch Customer List
```tsx
import { useCustomers } from '@/hooks/useERPNext';

export default function CustomerList() {
  const { data: customers, isLoading } = useCustomers();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <ul>
      {customers.map((customer) => (
        <li key={customer.name}>{customer.customer_name}</li>
      ))}
    </ul>
  );
}
```

### Create New Customer
```tsx
import { erpnext } from '@/lib/erpnext-client';

const createCustomer = async () => {
  const customer = await erpnext.createDoc('Customer', {
    customer_name: 'New Customer',
    customer_type: 'Company',
    customer_group: 'Commercial',
    territory: 'All Territories',
  });
  console.log('Created:', customer);
};
```

## API Reference

See the main README for complete API documentation and examples.