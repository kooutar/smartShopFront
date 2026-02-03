import { api } from "../authApi";

export const getOrders = () => {
  return api.get("/commandes");
};

export const confirmOrder = (id) => {
  return api.post(`/commandes/${id}/confirmer`);
};
