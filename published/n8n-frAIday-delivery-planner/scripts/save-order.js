const form = $input.first().json;
const orderId = 'ORD-' + Date.now().toString(36).toUpperCase().slice(-6);

return [{
  json: {
    orderId,
    customer: form['Customer Name'],
    phone: form['Phone'],
    address: form['Delivery Address'],
    items: form['Order Details'],
    total: Number(form['Total']) || 0,
    day: form['Delivery Day'],
    paid: form['Payment Status'] === 'Paid',
    notes: form['Notes'] || '',
    status: 'pending',
    receivedAt: new Date().toISOString(),
    message: `Order ${orderId} received. ${form['Customer Name']} for ${form['Delivery Day']}.`
  }
}];
