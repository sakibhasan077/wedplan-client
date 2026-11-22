"use server";

import { authFetch, protectedMutation } from "../core/server-session";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const paymentVerify = async (sessionId:string) =>{
  const url =`${BASE_URL}/payment/checkout`;
  const res = await protectedMutation(url,"POST",{sessionId})
  return res.json();
}

//get payment history
export const getPaymentHistory = async () => {
  if (!BASE_URL) {
    throw new Error("Payment history API is not configured.");
  }

  const url = `${BASE_URL}/payments/history`;
  const res = await authFetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch payment history (${res.status}).`);
  }

  return res.json();
}