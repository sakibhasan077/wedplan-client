"use server"

import { authFetch, protectedMutation } from "../core/server-session";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL;

// get users
export const getUsers = async (query = "") => {
  const url = `${BASE_URL}/users?${query}`;
  const res = await authFetch(url)
  return res.json();
}

// update
export const updateUser= async (userId:string,data:any)=>{
  const url = `${BASE_URL}/users/${userId}`;
  const res = await protectedMutation(url,"PATCH",data)
    return res.json();
}

// update users id
export const UpdateUsersProfile = async (userId: string, data: unknown) => {
  if (!BASE_URL) {
    throw new Error("User profile API is not configured.");
  }

  const url = `${BASE_URL}/users/profile/${userId}`;
  const res = await protectedMutation(url,"PATCH",data)

  if (!res.ok) {
    throw new Error(`Failed to update user profile (${res.status}).`);
  }

  return res.json();
}


// get users by id
export const getUserById = async (userId:string) =>{
  const url = `${BASE_URL}/users/brows-details/${userId}`;
  const res = await authFetch(url)
  return res.json();
}