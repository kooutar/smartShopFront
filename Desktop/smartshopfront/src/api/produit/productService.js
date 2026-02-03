import { api } from "../authApi";

export const addProduct = (productData) => {
  return api.post("/api/products", productData);
};

export const getProducts = () => {
  return api.get("/api/products");
};

export const updateProduct = (id, productData) => {
  return api.put(`/api/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return api.delete(`/api/products/${id}`);
};
