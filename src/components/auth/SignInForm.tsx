"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback states
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Beginner-friendly validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (res.error) {
        setErrors({ general: res.error.message || "Invalid email or password." });
        setIsLoading(false);
        return;
      }

      // Success feedback matching screenshot
      setSuccessMessage("You're all set!");

      // Slight delay so user sees feedback, then redirect
      setTimeout(() => {
        router.push(callbackUrl);
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrors({ general: message });
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrors({});
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Google sign in failed. Please try again.";
      setErrors({ general: message });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-sm w-full">
      {/* Header & Logo */}
      <div className="flex flex-col items-center text-center">
        <Link href="/" className="inline-block mb-3">
          <Image
            src="/images/logo.png"
            alt="WedPlan"
            width={160}
            height={48}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-semibold text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Sign in to continue planning something beautiful.
        </p>
      </div>

      {/* General Error Alert */}
      {errors.general && (
        <div className="mt-6 p-3 rounded-lg bg-status-rejected-bg text-status-rejected-text text-sm">
          {errors.general}
        </div>
      )}

      {/* Sign-in Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={isLoading}
            className={`w-full h-11 px-3.5 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.email
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              className={`w-full h-11 pl-3.5 pr-10 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.password
                  ? "border-destructive focus:ring-destructive/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive mt-1">{errors.password}</p>
          )}
        </div>

        {/* Success Alert Banner (Matches uploaded design) */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-status-approved-bg text-status-approved-text text-sm">
            <CheckCircle2 className="size-4 text-status-approved shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-full text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          <span>{isLoading ? "Signing In..." : "Sign In"}</span>
        </button>
      </form>

      {/* Or Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
        className="w-full h-11 border border-border bg-card hover:bg-secondary/30 text-foreground font-medium rounded-full text-sm transition-colors flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
      >
        {isGoogleLoading ? (
          <Loader2 className="size-4 animate-spin text-primary" />
        ) : (
          <svg className="size-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isGoogleLoading ? "Connecting..." : "Continue with Google"}</span>
      </button>

      {/* Footer Sign-up Link */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        New to WedPlan?{" "}
        <Link
          href="/sign-up"
          className="text-primary hover:underline font-medium"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
