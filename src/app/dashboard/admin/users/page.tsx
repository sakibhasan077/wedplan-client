import type { Metadata } from "next";
import UserSearchAndFilter from "@/components/dashboard/admin/UserSearchAndFilter";
import UsersTable from "@/components/dashboard/admin/UsersTable";
import { getUsers } from "@/lib/actions/users";

export const metadata: Metadata = {
  title: "Manage Users — WedPlan",
  description: "Search, review, and manage registered accounts.",
};

const AdminUserPage = async ({searchParams}:{searchParams: Promise<{ [key: string]: string | string[] | undefined }>}) => {
  const search = await searchParams;
  const query = new URLSearchParams(search as Record<string,string>).toString()
  const usersData = await getUsers(query);
  const users = Array.isArray(usersData) ? usersData : [];

  return (
    <main className="p-4 sm:p-6">
      <section className="mx-auto max-w-6xl rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <header className="mb-5">
          <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Search, review, and manage registered accounts.
          </p>
        </header>

        <UserSearchAndFilter />
        <UsersTable users={users} />
      </section>
    </main>
  );
};

export default AdminUserPage;
