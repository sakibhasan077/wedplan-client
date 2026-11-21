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