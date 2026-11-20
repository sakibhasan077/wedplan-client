const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// get users
export const getUsers = async (query = "") => {
  const url = `${BASE_URL}/users?${query}`;
  const res = await fetch(url)
  return res.json();
}

// update
export const updateUser = async (userId:string,data:any)=>{
  const url = `${BASE_URL}/users/${userId}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res.json();
}