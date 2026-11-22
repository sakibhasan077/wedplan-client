const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// get overview data for admin
export const getAdminOverview = async() =>{
  const res = await fetch(`${BASE_URL}/api/admin/overview`)
  if(!res.ok){
    throw new Error(`Failed to fetch overview data (${res.status})`)
  }
  const result = res.json()
  return result;
}