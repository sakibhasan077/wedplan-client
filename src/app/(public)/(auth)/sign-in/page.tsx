import type { Metadata } from "next";
import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In — WedPlan",
  description: "Sign in to your WedPlan account to manage your wedding plans or vendor services.",
};

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        <Suspense
          fallback={
            <div className="h-96 w-full rounded-2xl bg-card border border-border animate-pulse" />
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
