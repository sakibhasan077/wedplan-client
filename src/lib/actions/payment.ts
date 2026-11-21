const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const paymentVerify = async (sessionId:string) =>{
  const url =`${BASE_URL}/payment/checkout`;
  const res = await fetch(url,{
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({sessionId})
  })
  return res.json();
}

//get payment history
export const getPaymentHistory = async () => {
  if (!BASE_URL) {
    throw new Error("Payment history API is not configured.");
  }

  const url = `${BASE_URL}/payments/history`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch payment history (${res.status}).`);
  }

  return res.json();
}