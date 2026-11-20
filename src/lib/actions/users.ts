const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// get users
export const getUsers = async () => {
  const url = `${BASE_URL}/users`;
  const res = await fetch(url)
  return res.json();
}