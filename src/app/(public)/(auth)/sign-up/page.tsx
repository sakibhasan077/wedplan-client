import type { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create Account — WedPlan",
  description: "Sign up for WedPlan to plan your wedding or offer your vendor services.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
      <div className="w-full max-w-lg">
        <SignUpForm />
      </div>
    </div>
  );
}
