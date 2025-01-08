/* eslint-env node */

// 1) Import de Firebase Functions (v2) et Admin SDK
const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

// 2) Initialisation de l'app Firebase Admin (une seule fois)
admin.initializeApp();

/**
 * 3) Fonction onOrderCreated
 *    Déclenchée lorsqu'un document est créé dans la collection "orders/{orderId}"
 */
exports.onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  // Dans la v2, `event.data` est un DocumentSnapshot
  const snapshot = event.data;           // DocumentSnapshot
  const orderId = event.params.orderId;  // ex: "7fs45dG...", si vous voulez l'afficher

  const orderData = snapshot.data() || {};
  const productsOrdered = orderData.products || [];

  // Pour chaque produit commandé, on décrémente le stock
  for (const product of productsOrdered) {
    const productId = product.id;
    const quantity = product.quantity;
    const productRef = admin.firestore().collection("products").doc(productId);

    // Transaction Firestore pour décrémenter
    await admin.firestore().runTransaction(async (t) => {
      const productSnap = await t.get(productRef);
      if (!productSnap.exists) {
        throw new Error("Le produit n'existe pas !");
      }

      const productData = productSnap.data();
      const currentStock = productData.stock || 0;
      const newStock = currentStock - quantity;

      if (newStock < 0) {
        throw new Error("Pas assez de stock disponible !");
      }
      t.update(productRef, { stock: newStock });
    });
  }

  console.log(`Commande ${orderId} créée. Stock mis à jour.`);
});


/**
 * 4) Fonction onOrderDeleted
 *    Déclenchée lorsqu'un document est supprimé de "orders/{orderId}"
 */
exports.onOrderDeleted = onDocumentDeleted("orders/{orderId}", async (event) => {
  const snapshot = event.data;           
  const orderId = event.params.orderId;

  const orderData = snapshot.data() || {};
  const productsOrdered = orderData.products || [];

  // Pour chaque produit commandé, on restaure le stock
  for (const product of productsOrdered) {
    const productId = product.id;
    const quantity = product.quantity;
    const productRef = admin.firestore().collection("products").doc(productId);

    await admin.firestore().runTransaction(async (t) => {
      const productSnap = await t.get(productRef);
      if (!productSnap.exists) {
        throw new Error("Le produit n'existe pas !");
      }

      const productData = productSnap.data();
      const currentStock = productData.stock || 0;
      const restoredStock = currentStock + quantity;

      t.update(productRef, { stock: restoredStock });
    });
  }

  console.log(`Commande ${orderId} supprimée. Stock restauré.`);
});
