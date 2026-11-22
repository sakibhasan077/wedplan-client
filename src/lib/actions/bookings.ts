import toast from "react-hot-toast";

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
    toast.error(`Failed to add booking (${res.status}): ${result.message}`);
    return;
  }

  return result;
};
