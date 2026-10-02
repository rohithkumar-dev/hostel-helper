const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Hostel Helper database seed...');

  // 1. Seed or update Admin
  const adminUsername = process.env.ADMIN_INITIAL_USERNAME || 'rohit_admin';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'HH_Admin@2026#SRM';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        username: adminUsername,
        passwordHash,
      },
    });
    console.log(`✅ Admin created: ${adminUsername}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${adminUsername}`);
  }

  // 2. Seed Default Settings
  const settingsList = [
    { key: 'websiteName', value: 'HOSTEL HELPER', description: 'Name of the website' },
    { key: 'ownerName', value: 'K ROHIT KUMAR', description: 'Website owner / contact' },
    { key: 'location', value: 'SRM AP', description: 'Campus / Hostel location' },
    { key: 'whatsappNumber', value: '6300141729', description: 'WhatsApp contact number for requests' },
    {
      key: 'description',
      value: 'Quickly request deliveries, laundry services and hostel shop items.',
      description: 'Hero subtitle description',
    },
  ];

  for (const s of settingsList) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log('✅ Settings initialized');

  // 3. Seed Default Sections & Forms
  const sectionsData = [
    {
      slug: 'gate-delivery',
      name: 'GATE DELIVERY',
      description: 'Get your outside orders delivered from the hostel gate.',
      icon: 'DoorClosed',
      displayOrder: 1,
      forms: [
        {
          slug: 'food',
          name: 'FOOD',
          description: 'Hostel gate food delivery pickup',
          icon: 'Utensils',
          submitButtonText: 'SUBMIT FOOD REQUEST',
          whatsappFormat: 'HOSTEL HELPER - FOOD REQUEST',
          displayOrder: 1,
          fields: [
            { label: 'Item Name', fieldName: 'itemName', fieldType: 'text', placeholder: 'e.g. Biryani, Pizza, Burger', isRequired: true, displayOrder: 1 },
            { label: 'Quantity', fieldName: 'quantity', fieldType: 'number', placeholder: 'e.g. 1, 2, 3', isRequired: true, displayOrder: 2 },
            { label: 'Price', fieldName: 'price', fieldType: 'text', placeholder: 'e.g. ₹250', isRequired: true, displayOrder: 3 },
            { label: 'Restaurant Name', fieldName: 'restaurantName', fieldType: 'text', placeholder: "e.g. Domino's, Mehfil, Cafe Coffee Day", isRequired: true, displayOrder: 4 },
            { label: 'Contact Number', fieldName: 'contactNumber', fieldType: 'phone', placeholder: 'e.g. 9876543210', isRequired: true, displayOrder: 5 },
            { label: 'Additional Details', fieldName: 'additionalDetails', fieldType: 'textarea', placeholder: 'Any special instructions or gate details...', isRequired: false, displayOrder: 6 },
          ],
        },
        {
          slug: 'bigbasket',
          name: 'BIGBASKET',
          description: 'BigBasket parcel pickup from gate',
          icon: 'ShoppingBag',
          submitButtonText: 'SUBMIT BIGBASKET REQUEST',
          whatsappFormat: 'HOSTEL HELPER - BIGBASKET REQUEST',
          displayOrder: 2,
          fields: [
            { label: 'Item Name', fieldName: 'itemName', fieldType: 'text', placeholder: 'e.g. Grocery essentials / Fruits & Snacks', isRequired: true, displayOrder: 1 },
            { label: 'Price', fieldName: 'price', fieldType: 'text', placeholder: 'e.g. ₹540', isRequired: true, displayOrder: 2 },
            { label: 'Item Details', fieldName: 'itemDetails', fieldType: 'textarea', placeholder: 'Brief summary of items in parcel...', isRequired: true, displayOrder: 3 },
            { label: 'Quantity / Amount', fieldName: 'quantityOrAmount', fieldType: 'text', placeholder: 'e.g. 2 bags or 5 items', isRequired: true, displayOrder: 4 },
            { label: 'Contact Number', fieldName: 'contactNumber', fieldType: 'phone', placeholder: 'e.g. 9876543210', isRequired: true, displayOrder: 5 },
            { label: 'Additional Details', fieldName: 'additionalDetails', fieldType: 'textarea', placeholder: 'Delivery slot or gate instructions...', isRequired: false, displayOrder: 6 },
          ],
        },
        {
          slug: 'online-order',
          name: 'ONLINE ORDER',
          description: 'Amazon, Flipkart, Myntra parcel pickup',
          icon: 'Package',
          submitButtonText: 'SUBMIT ONLINE ORDER',
          whatsappFormat: 'HOSTEL HELPER - ONLINE ORDER',
          displayOrder: 3,
          fields: [
            { label: 'Item Name', fieldName: 'itemName', fieldType: 'text', placeholder: 'e.g. Books, Shoes, Electronics', isRequired: true, displayOrder: 1 },
            { label: 'Delivered From', fieldName: 'deliveredFrom', fieldType: 'text', placeholder: 'e.g. Amazon, Flipkart, Myntra, Bluedart', isRequired: true, displayOrder: 2 },
            { label: 'Delivery Time', fieldName: 'deliveryTime', fieldType: 'text', placeholder: 'e.g. Today 4:00 PM, or OTP pending', isRequired: true, displayOrder: 3 },
            { label: 'Price', fieldName: 'price', fieldType: 'text', placeholder: 'e.g. Paid online or COD ₹399', isRequired: true, displayOrder: 4 },
            { label: 'Contact Number', fieldName: 'contactNumber', fieldType: 'phone', placeholder: 'e.g. 9876543210', isRequired: true, displayOrder: 5 },
            { label: 'Additional Details', fieldName: 'additionalDetails', fieldType: 'textarea', placeholder: 'Tracking ID, courier name, or special instructions...', isRequired: false, displayOrder: 6 },
          ],
        },
      ],
    },
    {
      slug: 'laundry',
      name: 'LAUNDRY',
      description: 'Submit and manage your hostel laundry request.',
      icon: 'Shirt',
      displayOrder: 2,
      forms: [
        {
          slug: 'laundry-request',
          name: 'LAUNDRY REQUEST',
          description: 'Hostel laundry collection & wash request',
          icon: 'Shirt',
          submitButtonText: 'SUBMIT LAUNDRY REQUEST',
          whatsappFormat: 'HOSTEL HELPER - LAUNDRY REQUEST',
          displayOrder: 1,
          fields: [
            { label: 'Laundry Bag Color', fieldName: 'bagColor', fieldType: 'text', placeholder: 'e.g. Blue, Red, Black, Green', isRequired: true, displayOrder: 1 },
            { label: 'Application Number', fieldName: 'applicationNumber', fieldType: 'text', placeholder: 'e.g. AP21110010001', isRequired: true, displayOrder: 2 },
            { label: 'Student Name', fieldName: 'studentName', fieldType: 'text', placeholder: 'e.g. Rohit Kumar', isRequired: true, displayOrder: 3 },
            { label: 'QR Number', fieldName: 'qrNumber', fieldType: 'text', placeholder: 'e.g. QR-8849', isRequired: true, displayOrder: 4 },
            { label: 'Basement Contact Number', fieldName: 'basementContact', fieldType: 'phone', placeholder: 'e.g. 9876543210', isRequired: true, displayOrder: 5 },
            { label: 'Additional Details', fieldName: 'additionalDetails', fieldType: 'textarea', placeholder: 'Number of cloths, delicate items, or specific instructions...', isRequired: false, displayOrder: 6 },
          ],
        },
      ],
    },
    {
      slug: 'shops',
      name: 'SHOPS',
      description: 'Request items from available hostel shops.',
      icon: 'Store',
      displayOrder: 3,
      forms: [
        {
          slug: 'total-fresh',
          name: 'TOTAL FRESH',
          description: 'Fresh juices, dairy, fruits and snacks from Total Fresh',
          icon: 'Store',
          submitButtonText: 'SUBMIT SHOP REQUEST',
          whatsappFormat: 'HOSTEL HELPER - SHOP REQUEST',
          displayOrder: 1,
          fields: [
            { label: 'Item Name', fieldName: 'itemName', fieldType: 'text', placeholder: 'e.g. Milk packet, Banana smoothie, Bread', isRequired: true, displayOrder: 1 },
            { label: 'Quantity', fieldName: 'quantity', fieldType: 'text', placeholder: 'e.g. 2 packs, 500ml', isRequired: true, displayOrder: 2 },
            { label: 'Contact Number', fieldName: 'contactNumber', fieldType: 'phone', placeholder: 'e.g. 9876543210', isRequired: true, displayOrder: 3 },
            { label: 'Additional Details', fieldName: 'additionalDetails', fieldType: 'textarea', placeholder: 'Room number, hostel block, or substitute preference...', isRequired: false, displayOrder: 4 },
          ],
        },
      ],
    },
  ];

  for (const s of sectionsData) {
    const section = await prisma.section.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        icon: s.icon,
        displayOrder: s.displayOrder,
      },
      create: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        icon: s.icon,
        displayOrder: s.displayOrder,
        isActive: true,
      },
    });

    console.log(`📦 Section: ${section.name}`);

    for (const f of s.forms) {
      let form = await prisma.form.findFirst({
        where: { sectionId: section.id, slug: f.slug },
      });

      if (!form) {
        form = await prisma.form.create({
          data: {
            sectionId: section.id,
            slug: f.slug,
            name: f.name,
            description: f.description,
            icon: f.icon,
            submitButtonText: f.submitButtonText,
            whatsappFormat: f.whatsappFormat,
            displayOrder: f.displayOrder,
            isActive: true,
          },
        });
      }

      // Re-create or update fields
      for (const fld of f.fields) {
        const existingField = await prisma.formField.findFirst({
          where: { formId: form.id, fieldName: fld.fieldName },
        });

        if (!existingField) {
          await prisma.formField.create({
            data: {
              formId: form.id,
              label: fld.label,
              fieldName: fld.fieldName,
              fieldType: fld.fieldType,
              placeholder: fld.placeholder,
              isRequired: fld.isRequired,
              displayOrder: fld.displayOrder,
            },
          });
        }
      }
      console.log(`  📄 Form: ${form.name} (${f.fields.length} fields)`);
    }
  }

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
