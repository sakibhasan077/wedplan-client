import { headers } from "next/headers";
import { auth } from "../auth";
import { redirect } from "next/navigation";

export const getServerSession = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    return session;
};

export const requiredRole = async (role: string) => {
    const session = await getServerSession();
    if (!session || session.user.role !== role) {
        redirect("/unauthorized")
    }
}