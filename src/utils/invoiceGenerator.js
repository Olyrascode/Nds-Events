import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export const generateInvoicePDF = async (order) => {
  const doc = new jsPDF();

  // Ajouter un logo (optionnel)
  const logo = '../../img/home/logoHomePage.png'; // Remplacez par le chemin de votre logo
  doc.addImage(logo, 'PNG', 20, 10, 50, 15);

  // Titre principal
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text('Facture', 105, 30, { align: 'center' });

  // Conversion des dates
  const createdAt = order.createdAt instanceof Date ? order.createdAt : order.createdAt.toDate();
  const startDate = order.startDate instanceof Date ? order.startDate : order.startDate.toDate();
  const endDate = order.endDate instanceof Date ? order.endDate : order.endDate.toDate();

  // Commande et date
  doc.setFontSize(12);
  doc.text(`Commande #: ${order.id}`, 20, 50);
  doc.text(`Date: ${format(createdAt, 'PP')}`, 20, 60);

  // Ligne de séparation
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 65, 190, 65);

  // Informations client
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Informations du client', 20, 75);

  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`${order.billingInfo.firstName} ${order.billingInfo.lastName}`, 20, 85);
  doc.text(order.billingInfo.email, 20, 95);
  doc.text(order.billingInfo.address, 20, 105);
  doc.text(`${order.billingInfo.city}, ${order.billingInfo.zipCode}`, 20, 115);

  // Informations de livraison (si applicable)
  if (order.deliveryMethod === 'delivery') {
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Informations de livraison', 105, 75);

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(order.shippingInfo.address, 105, 85);
    doc.text(`${order.shippingInfo.city}, ${order.shippingInfo.zipCode}`, 105, 95);
  }

  // Tableau des produits
  const tableStartY = 125;
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text('Détails des produits', 20, tableStartY - 10);

  const tableData = order.products.map((item) => [
    item.title,
    item.quantity,
    `${item.price.toFixed(2)} €`,
    `${(item.price * item.quantity).toFixed(2)} €`,
  ]);

  doc.autoTable({
    head: [['Produit', 'Quantité', 'Prix/jour', 'Total']],
    body: tableData,
    startY: tableStartY,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [40, 40, 40],
      textColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Total et informations supplémentaires
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(
    `Période de location: ${format(startDate, 'PP')} - ${format(endDate, 'PP')}`,
    20,
    finalY
  );
  doc.text(
    `Méthode de réception: ${order.deliveryMethod === 'delivery' ? 'Livraison (60 €)' : 'Pickup (Gratuit)'}`,
    20,
    finalY + 10
  );

  // Total
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.text(`Total: ${order.total.toFixed(2)} €`, 20, finalY + 20);

  // Téléchargement du PDF
  doc.save(`Facture_${order.id}.pdf`);
};
