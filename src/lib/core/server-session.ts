import { headers } from "next/headers";
import { auth } from "../auth";

export const useServerSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
};