async function testForms() {
  const tests = [
    {
      sectionSlug: 'gate-delivery',
      formSlug: 'bigbasket',
      fields: {
        itemName: 'Fruits & Vegetables Basket',
        price: '₹550',
        itemDetails: 'Apples, Milk, Bread, Eggs',
        quantityOrAmount: '2 bags',
        contactNumber: '9876543210',
        additionalDetails: 'Slot 4-6 PM',
      },
    },
    {
      sectionSlug: 'gate-delivery',
      formSlug: 'online-order',
      fields: {
        itemName: 'Electronics / Laptop Stand',
        deliveredFrom: 'Amazon',
        deliveryTime: '5:00 PM',
        price: 'Prepaid',
        contactNumber: '9876543210',
        additionalDetails: 'PIN 522502',
      },
    },
    {
      sectionSlug: 'laundry',
      formSlug: 'laundry-request',
      fields: {
        bagColor: 'Blue',
        applicationNumber: 'AP21110010042',
        studentName: 'Rohit Kumar',
        qrNumber: 'QR-9901',
        basementContact: '9876543210',
        additionalDetails: 'Total 12 clothes',
      },
    },
    {
      sectionSlug: 'shops',
      formSlug: 'total-fresh',
      fields: {
        itemName: 'Mango Shake & Sandwich',
        quantity: '1 each',
        contactNumber: '9876543210',
        additionalDetails: 'Block 2, Room 405',
      },
    },
  ];

  for (const t of tests) {
    const res = await fetch('http://localhost:3000/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(t),
    });
    const data = await res.json();
    console.log(`✅ [${t.sectionSlug}/${t.formSlug}] -> Request ID: ${data.requestId}`);
  }
}

testForms().catch(console.error);
