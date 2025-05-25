import useSWR from 'swr';
import { erpnext } from '../lib/erpnext-client';

// Generic list hook
export function useDocList(doctype: string, fields?: string[], filters?: any) {
  const key = filters 
    ? `${doctype}-${JSON.stringify(filters)}` 
    : doctype;

  const { data, error, mutate } = useSWR(
    key,
    () => erpnext.getList(doctype, fields, filters),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    data: data?.data || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// Single document hook
export function useDoc(doctype: string, name: string) {
  const { data, error, mutate } = useSWR(
    name ? `${doctype}-${name}` : null,
    () => erpnext.getDoc(doctype, name),
    {
      revalidateOnFocus: false,
    }
  );

  return {
    doc: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

// Example: Customer hook
export function useCustomers() {
  return useDocList('Customer', ['name', 'customer_name', 'territory', 'customer_group']);
}

// Example: Sales Order hook
export function useSalesOrders(filters?: any) {
  return useDocList('Sales Order', 
    ['name', 'customer', 'grand_total', 'status', 'transaction_date'],
    filters
  );
}

// Example: Item hook
export function useItems() {
  return useDocList('Item', ['name', 'item_name', 'item_group', 'stock_uom', 'description']);
}

// Example: Purchase Order hook
export function usePurchaseOrders(filters?: any) {
  return useDocList('Purchase Order',
    ['name', 'supplier', 'grand_total', 'status', 'transaction_date'],
    filters
  );
}