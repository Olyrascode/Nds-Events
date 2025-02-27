// import { calculateRentalDays } from './dateUtils';

// export const DELIVERY_FEE = 60;

// export const calculateOrderTotal = (cart, startDate, endDate, deliveryMethod) => {
//   const days = calculateRentalDays(startDate, endDate);
  
//   // Calculate items total
//   const itemsTotal = cart.reduce((total, item) => {
//     const itemPrice = item.price * item.quantity * days;
//     const discount = item.type === 'pack' ? (itemPrice * item.discountPercentage) / 100 : 0;
//     return total + (itemPrice - discount);
//   }, 0);

//   // Add delivery fee if applicable
//   const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;

//   return {
//     itemsTotal,
//     deliveryFee,
//     total: itemsTotal + deliveryFee
//   };
// };

// export const formatPrice = (price) => {
//   return `€${typeof price === 'number' ? price.toFixed(2) : '0.00'}`;
// };
export const DELIVERY_FEE = 60;

/**
 * Calcule le total de la commande en utilisant les prix enregistrés dans le panier.
 * @param {Array} cart - Liste des articles dans le panier.
 * @param {string} deliveryMethod - Méthode de livraison (delivery/pickup).
 * @returns {Object} - Total des produits, frais de livraison, et total général.
 */
export const calculateOrderTotal = (cart, deliveryMethod) => {
  // Total des produits basé sur le prix enregistré dans le panier
  const itemsTotal = cart.reduce((total, item) => total + parseFloat(item.price), 0);

  // Ajouter les frais de livraison si applicable
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;

  return {
    itemsTotal,
    deliveryFee,
    total: itemsTotal + deliveryFee
  };
};

/**
 * Formate le prix en ajoutant le symbole € et deux décimales.
 * @param {number} price - Le prix à formater.
 * @returns {string} - Le prix formaté.
 */
export const formatPrice = (price) => {
  return `€${typeof price === 'number' ? price.toFixed(2) : '0.00'}`;
};
