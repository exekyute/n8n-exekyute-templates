const items = $input.all();
const realPages = items.filter(item => item.json && item.json.id && item.json.properties);

if (realPages.length === 0) {
  return [{ json: { _empty: true } }];
}

const text = (prop) => {
  if (!prop) return '';
  if (Array.isArray(prop.title)) return prop.title.map(t => t.plain_text).join('');
  if (Array.isArray(prop.rich_text)) return prop.rich_text.map(t => t.plain_text).join('');
  return '';
};

const allOrders = realPages.map(item => {
  const props = item.json.properties || {};
  return {
    id: text(props['Order ID']),
    customer: text(props['Customer Name']),
    phone: (props['Phone'] && props['Phone'].phone_number) || '',
    address: text(props['Address']),
    items: text(props['Items']),
    total: (props['Total'] && props['Total'].number) || 0,
    day: (props['Day'] && props['Day'].select && props['Day'].select.name) || '',
    paid: (props['Paid'] && props['Paid'].checkbox) || false,
    notes: text(props['Notes']),
    status: (props['Status'] && props['Status'].select && props['Status'].select.name) || 'pending',
    receivedAt: (props['Received At'] && props['Received At'].date && props['Received At'].date.start) || ''
  };
});

const pending = allOrders.filter(o => o.status === 'pending');

if (pending.length === 0) {
  return [{ json: { _empty: true } }];
}

return pending.map(order => ({ json: order }));
