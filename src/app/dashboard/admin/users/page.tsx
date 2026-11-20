import Image from "next/image";
import type { Metadata } from "next";
import UserSearchAndFilter from "@/components/dashboard/admin/UserSearchAndFilter";
import { getUsers } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";

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

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-3 font-medium">User</th>
                <th className="px-3 py-3 font-medium">Email</th>
                <th className="px-3 py-3 font-medium">Role</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const name = user.name || "Unknown user";
                const isBlocked = user.isBlocked === true;

                return (
                  <tr key={user._id || user.id || user.email}>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt=""
                              fill
                              unoptimized
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium">{name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs capitalize ${
                          user.role === "vendor"
                            ? "bg-gold-muted text-gold"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {user.role || "customer"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${
                          isBlocked
                            ? "bg-status-rejected-bg text-status-rejected-text"
                            : "bg-status-approved-bg text-status-approved-text"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            isBlocked
                              ? "bg-status-rejected"
                              : "bg-status-approved"
                          }`}
                        />
                        {isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-2">
                        {/* TODO: Add a user details view. */}
                        <Button type="button" variant="outline" size="sm">
                          View
                        </Button>
                        {/* TODO: Connect this button to the block/unblock API. */}
                        <Button
                          type="button"
                          size="sm"
                          variant={isBlocked ? "outline" : "default"}
                          className={
                            isBlocked
                              ? "border-status-approved text-status-approved-text hover:bg-status-approved-bg"
                              : ""
                          }
                        >
                          {isBlocked ? "Unblock" : "Block"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-10 text-center text-muted-foreground"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default AdminUserPage;
