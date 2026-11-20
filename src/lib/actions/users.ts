const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// get users
export const getUsers = async (query = "") => {
  const url = `${BASE_URL}/users?${query}`;
  const res = await fetch(url)
  return res.json();
}