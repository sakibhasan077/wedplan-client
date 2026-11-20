const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// post request to the server
export const addService = async (data: any) => {
  try {
    const url = `${BASE_URL}/services`;
    const res= await fetch(url,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    return res.json();
  }catch (error) {
    console.error('Error occurred while making POST request:', error);
    throw error;
  }
}

// Get Services by vendor id
export const getServicesByVendorId = async (vendorId: string) => {
  try {
    const url = `${BASE_URL}/services/${vendorId}`;
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.error('Error occurred while making GET request:', error);
    throw error;
  }
}