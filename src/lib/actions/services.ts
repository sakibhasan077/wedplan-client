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

// Get Services by id
export const getServiceById = async (serviceId: string) => {
  const res = await fetch(`${BASE_URL}/services/${serviceId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch service');
  }
  return res.json();
}

// Get Services by vendor id
export const getServicesByVendorId = async (vendorId: string) => {
  try {
    const url = `${BASE_URL}/services/vendor/${vendorId}`;
    const res = await fetch(url);
    return res.json();
  } catch (error) {
    console.error('Error occurred while making GET request:', error);
    throw error;
  }
}

// update Services
export const updateServices = async(serviceId: string, data: any) => {
  try {
    const url = `${BASE_URL}/services/${serviceId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
  }catch (error) {
    console.error('Error occurred while making PUT request:', error);
    throw error;
  }
}

//Delete Services
export const deleteService = async(serviceId: string) => {
  try {
    const url = `${BASE_URL}/services/${serviceId}`;
    const res = await fetch(url, {
      method: 'DELETE',
    });
    return res.json();
  }catch (error) {
    console.error('Error occurred while making DELETE request:', error);
    throw error;
  }
}
