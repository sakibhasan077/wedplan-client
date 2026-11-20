"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateUser } from "@/lib/actions/users";

type User = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  subscriptionPlan?: string;
  image?: string;
  isBlocked?: boolean;
};

type UsersTableProps = {
  users: User[];
};

function getUserKey(user: User) {
  return user._id || user.id || user.email || user.name || "";
}

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleView = (user: User) => {
    setSelectedUser(user);
  };

  const handleBlockToggle = async(selectedUser: User) => {
    const userKey = getUserKey(selectedUser);
    const nextIsBlocked = selectedUser.isBlocked !== true;

    // TODO: Call the block/unblock API here. This currently only changes local UI state.
    const id = selectedUser._id as string;
    const data = { isBlocked: nextIsBlocked };
    const result = await updateUser(id,data);
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        getUserKey(user) === userKey
          ? { ...user, isBlocked: nextIsBlocked }
          : user,
      ),
    );
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[780px] text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-3 font-medium">User</th>
            <th className="px-3 py-3 font-medium">Email</th>
            <th className="px-3 py-3 font-medium">Role</th>
            <th className="px-3 py-3 font-medium">Plan</th>
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
                  {user.role === "vendor" && user.subscriptionPlan ? (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs capitalize text-accent-foreground">
                      {user.subscriptionPlan}
                    </span>
                  ) : <span>--</span>}
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
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(user)}
                    >
                      View
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={isBlocked ? "outline" : "default"}
                      className={
                        isBlocked
                          ? "border-status-approved text-status-approved-text hover:bg-status-approved-bg"
                          : ""
                      }
                      onClick={() => handleBlockToggle(user)}
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
                colSpan={6}
                className="px-3 py-10 text-center text-muted-foreground"
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Dialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open) setSelectedUser(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User details</DialogTitle>
            <DialogDescription>
              Account information for this user.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-3">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedUser.name || "Unknown user"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedUser.email || "Not provided"}
              </p>
              <p>
                <span className="font-medium">Role:</span>{" "}
                <span className="capitalize">
                  {selectedUser.role || "customer"}
                </span>
              </p>
              {selectedUser.role === "vendor" &&
                selectedUser.subscriptionPlan && (
                  <p>
                    <span className="font-medium">Subscription plan:</span>{" "}
                    <span className="capitalize">
                      {selectedUser.subscriptionPlan}
                    </span>
                  </p>
                )}
              <p>
                <span className="font-medium">Status:</span>{" "}
                {selectedUser.isBlocked ? "Blocked" : "Active"}
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
