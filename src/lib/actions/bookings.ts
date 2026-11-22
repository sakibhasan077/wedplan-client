const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// post
export const addBookings = async (data: unknown) => {
  if (!BASE_URL) {
    throw new Error("Booking service is not configured.");
  }

  const url = `${BASE_URL}/bookings`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
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

// get booking data
export const getMyBooking = async(query="") =>{
  const url = `${BASE_URL}/bookings/bookings/my?${query}`;
  const res = await fetch(url);
  if(!res.ok){
    throw new Error(`Failed to fetch bookings (${res.status})`)
  }
  const result = res.json();
  return result;
}

// cancel booking request
export const cancelBooking = async(id:string) =>{
  if (!BASE_URL) {
    throw new Error("Booking service is not configured.");
  }

  const url = `${BASE_URL}/bookings/${id}/cancel`;
  const res = await fetch(url,{
    method: "DELETE"
  });

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