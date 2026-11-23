"use server"
import { authFetch, protectedMutation } from "../core/server-session";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// post request to the server(done)
export const addService = async (data: unknown) => {
  try {
    const url = `${BASE_URL}/services`;
    const res = await protectedMutation(url,"POST",data)
    return res.json();
  }catch (error) {
    console.error('Error occurred while making POST request:', error);
    throw error;
  }
}

//count services (done)
export const countServices = async(query="") =>{
  const url = `${BASE_URL}/services/count?${query}`
  const res = await authFetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch service');
  }
  return res.json();

}

// Get Services by id (done)
export const getServiceById = async (serviceId: string) => {
  if (!/^[\da-f]{24}$/i.test(serviceId)) {
    return null;
  }

  const api = `${BASE_URL}/services/${serviceId}`;
  const res = await authFetch(api);
  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch service (${res.status}).`);
  }

  const responseBody = await res.text();
  if (!responseBody.trim()) {
    return null;
  }

  if (!res.headers.get("content-type")?.includes("application/json")) {
    throw new Error("Failed to fetch service: server returned a non-JSON response.");
  }

  return JSON.parse(responseBody);
}

// Get Services by vendor id (done)
export const getServicesByVendorId = async (vendorId: string) => {
  try {
    if (!BASE_URL) {
      throw new Error("Service API is not configured.");
    }

    const url = `${BASE_URL}/services/vendor/${vendorId}`;
    const res = await authFetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch vendor services (${res.status}).`);
    }

    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Failed to fetch vendor services: server returned a non-JSON response.");
    }

    return await res.json();
  } catch (error) {
    console.error('Error occurred while making GET request:', error);
    throw error;
  }
}

// update Services by vendor
export const updateServices = async(
  serviceId: string,
  data: Record<string, unknown>,
) => {
  try {
    const url = `${BASE_URL}/services/${serviceId}`;
    const res = await protectedMutation(url,"PATCH",data)
    return res.json();
  }catch (error) {
    console.error('Error occurred while making PUT request:', error);
    throw error;
  }
}

//Delete Services by vendor
export const deleteService = async(serviceId: string) => {
  try {
    const url = `${BASE_URL}/services/${serviceId}`;
    const res = await protectedMutation(url,"DELETE")
    // const res = await fetch(url, {
    //   method: 'DELETE',
    // });
    return res.json();
  }catch (error) {
    console.error('Error occurred while making DELETE request:', error);
    throw error;
  }
}

// update Services by admin
export const updateServicesByAdmin = async(
  serviceId: string,
  data: Record<string, unknown>,
) => {
  try {
    const url = `${BASE_URL}/services/${serviceId}/admin`;
    const res = await protectedMutation(url, "PATCH", data);
    if (!res.ok) {
      throw new Error(`Failed to update service (${res.status}).`);
    }

    if (!res.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Failed to update service: server returned a non-JSON response.");
    }

    return res.json();
  }catch (error) {
    console.error('Error occurred while updating service by admin:', error);
    throw error;
  }
}

//Delete Services by vendor
export const deleteServiceByAdmin = async(serviceId: string) => {
  try {
    const url = `${BASE_URL}/services/${serviceId}/admin`;
    const res = await protectedMutation(url,"DELETE")
    return res.json();
  }catch (error) {
    console.error('Error occurred while making DELETE request:', error);
    throw error;
  }
}

// Get all services for the admin review page
export const getAdminServices = async (query="") => {
  try {
    const url = `${BASE_URL}/admin/services?${query}`;
    const res = await authFetch(url)
    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error occurred while fetching admin services:", error);
    return [];
  }
}


// get data for brows jobs
export const getBrowseService = async (query="")=>{
  const url = `${BASE_URL}/services/browse?${query}`;
  const res = await fetch(url);
  return res.json();
}