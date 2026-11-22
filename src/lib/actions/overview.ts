const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// get overview data for admin
export const getAdminOverview = async () => {
  const res = await fetch(`${BASE_URL}/api/admin/overview`);
  if (!res.ok) {
    throw new Error(`Failed to fetch overview data (${res.status})`);
  }
  const result = res.json();
  return result;
};

// get vendor overview
export const getVendorOverview = async (vendorId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/vendor/overview?vendorId=${vendorId}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch vendor overview (${res.status})`);
  }

  return res.json();
};
// get customer overview
export const getCustomerOverview = async (customerId: string) => {
  const res = await fetch(
    `${BASE_URL}/api/customer/overview?customerId=${customerId}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch customer overview (${res.status})`);
  }

  return res.json();
};
