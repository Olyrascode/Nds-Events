import { format } from 'date-fns';
import { formatPrice } from './priceUtils';

export const generateInvoicePDF = async (order) => {
  // This is a mock implementation
  // In a real application, you would use a library like pdfmake or jsPDF
  // to generate a proper PDF invoice
  
  const invoiceData = {
    orderNumber: order.id,
    date: format(new Date(order.createdAt), 'PP'),
    customer: {
      name: `${order.billingInfo.firstName} ${order.billingInfo.lastName}`,
      email: order.billingInfo.email,
      address: order.billingInfo.address,
      city: order.billingInfo.city,
      zipCode: order.billingInfo.zipCode
    },
    items: order.products.map(item => ({
      name: item.title,
      quantity: item.quantity,
      pricePerDay: item.price,
      options: item.selectedOptions
    })),
    rentalPeriod: {
      start: format(new Date(order.startDate), 'PP'),
      end: format(new Date(order.endDate), 'PP')
    },
    delivery: {
      method: order.deliveryMethod,
      fee: order.deliveryMethod === 'delivery' ? 60 : 0
    },
    total: order.total
  };

  // Mock PDF generation
  console.log('Generating invoice PDF with data:', invoiceData);
  
  // Simulate PDF download
  const blob = new Blob(['Mock Invoice PDF'], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `invoice-${order.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};