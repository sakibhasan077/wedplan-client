"use server";
import { authFetch, protectedMutation } from "../core/server-session";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// post
export const addBookings = async (data: unknown) => {
  if (!BASE_URL) {
    throw new Error("Booking service is not configured.");
  }

  const url = `${BASE_URL}/bookings`;
    const res = await protectedMutation(url,"POST",data)
  const result = await res.json();

  if (!res.ok) {
    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : `Failed to add booking (${res.status}).`,
    );
  }

  return result;
};

// get booking data by user
export const getMyBooking = async(query="") =>{
  const url = `${BASE_URL}/bookings/bookings/my?${query}`;
  const res = await authFetch(url)
  if(!res.ok){
    throw new Error(`Failed to fetch bookings (${res.status})`)
  }
  const result = res.json();
  return result;
}

// get booking data by vendor
export const getBookingByVendor = async(query="") =>{
  const url = `${BASE_URL}/bookings/bookings/vendor?${query}`;
  const res = await authFetch(url)
  if(!res.ok){
    throw new Error(`Failed to fetch bookings (${res.status})`)
  }
  const result = res.json();
  return result;
}

// update status
export const updateStatus = async(id:string, status:unknown)=>{
  if (!BASE_URL) {
    throw new Error("Booking service is not configured.");
  }

  const url = `${BASE_URL}/bookings/${id}/status`;
  const res = await protectedMutation(url,"PATCH",status)
  const result = await res.json();
  if(!res.ok){
    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : `Failed to update booking (${res.status}).`,
    );
  }
  return result;
};

// cancel booking request
export const cancelBooking = async(id:string) =>{
  if (!BASE_URL) {
    throw new Error("Booking service is not configured.");
  }

  const url = `${BASE_URL}/bookings/${id}/cancel`;
  const res = await protectedMutation(url,"DELETE")

  const result = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof result?.message === "string"
        ? result.message
        : `Failed to cancel booking (${res.status}).`,
    );
  }

  return result;
}