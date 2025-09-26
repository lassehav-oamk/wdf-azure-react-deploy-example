import type { ProductsResponse } from '../types/product';

const API_BASE_URL = 'https://dummyjson.com';

export const fetchProducts = async (): Promise<ProductsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};