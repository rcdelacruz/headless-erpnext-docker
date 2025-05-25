import { useState } from 'react';
import { useCustomers } from '../hooks/useERPNext';
import { erpnext } from '../lib/erpnext-client';

export default function CustomerList() {
  const { data: customers, isLoading, isError, mutate } = useCustomers();
  const [isCreating, setIsCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    customer_name: '',
    customer_type: 'Company',
    customer_group: 'Commercial',
    territory: 'All Territories',
  });

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      await erpnext.createDoc('Customer', newCustomer);
      // Refresh the list
      mutate();
      // Reset form
      setNewCustomer({
        customer_name: '',
        customer_type: 'Company',
        customer_group: 'Commercial',
        territory: 'All Territories',
      });
      alert('Customer created successfully!');
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer');
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) return <div className="p-4">Loading customers...</div>;
  if (isError) return <div className="p-4 text-red-600">Error loading customers</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      
      {/* Create Customer Form */}
      <form onSubmit={handleCreateCustomer} className="mb-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Create New Customer</h3>
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer Name</label>
            <input
              type="text"
              value={newCustomer.customer_name}
              onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Customer Type</label>
            <select
              value={newCustomer.customer_type}
              onChange={(e) => setNewCustomer({ ...newCustomer, customer_type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="Company">Company</option>
              <option value="Individual">Individual</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isCreating ? 'Creating...' : 'Create Customer'}
          </button>
        </div>
      </form>

      {/* Customer List */}
      <div className="grid gap-2">
        {customers.map((customer: any) => (
          <div key={customer.name} className="p-4 border rounded-lg hover:bg-gray-50">
            <h3 className="font-semibold">{customer.customer_name}</h3>
            <p className="text-sm text-gray-600">
              {customer.territory} - {customer.customer_group}
            </p>
            <p className="text-xs text-gray-500 mt-1">ID: {customer.name}</p>
          </div>
        ))}
      </div>
      
      {customers.length === 0 && (
        <p className="text-gray-500 text-center py-4">No customers found</p>
      )}
    </div>
  );
}