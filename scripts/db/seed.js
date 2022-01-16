/* eslint-disable @typescript-eslint/no-var-requires */

const { PrismaClient } = require('@prisma/client');
const randomstring = require('randomstring');

const client = new PrismaClient();

function voucherGenerate(n) {
  const vouchers = [];

  for (let i = 0; i < n; i++) {
    vouchers.push({
      code: randomstring.generate(),
    });
  }

  return vouchers;
}

(async function () {
  // Seed Customers
  const customersInitial = [
    {
      id: 1,
      firstName: 'Sandy',
      lastName: 'Gunawan',
      email: 'sandyz.boyz@gmail.com',
      contactNumber: '817-123-4567',
      dateOfBirth: new Date('1996-01-01'),
      gender: 'Male',
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@gmail.com',
      contactNumber: '817-123-4567',
      dateOfBirth: new Date('1996-01-01'),
      gender: 'Male',
    },
  ];

  const transactionsInitial = [
    {
      id: 1,
      customerId: 1,
      totalSpent: 35000,
      totalSaving: 0,
    },
    {
      id: 2,
      customerId: 1,
      totalSpent: 35000,
      totalSaving: 0,
    },
    {
      id: 3,
      customerId: 1,
      totalSpent: 35000,
      totalSaving: 0,
    },
    {
      id: 4,
      customerId: 2,
      totalSpent: 35000,
      totalSaving: 0,
    },
    {
      id: 5,
      customerId: 2,
      totalSpent: 35000,
      totalSaving: 0,
    },
  ];

  const vouchersInitial = voucherGenerate(100);

  await client.customer.createMany({
    data: customersInitial,
  });

  await client.purchaseTransaction.createMany({
    data: transactionsInitial,
  });

  await client.voucher.createMany({
    data: vouchersInitial,
  });
})();
