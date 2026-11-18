"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, UploadCloud, User, Store, X, Loader2 } from "lucide-react";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  general?: string;
}

export default function SignUpForm() {
  const router = useRouter();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"customer" | "vendor">("customer");

  // Profile image states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status and error states
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Handle image file selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          general: "Image file size should not exceed 5MB",
        }));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  // Helper to upload image to ImgBB if key exists
  const uploadToImgBB = async (file: File): Promise<string | undefined> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) return undefined;

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data?.data?.url) {
        return data.data.url;
      }
    } catch {
      // Gracefully continue without failing registration
      console.warn("Failed to upload image to ImgBB");
    }
    return undefined;
  };

  // Beginner-friendly form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    else if(fullName.trim().length <3){
      newErrors.fullName = "Full name must be at least 3 characters"
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate password: min 6 chars, 1 uppercase, 1 lowercase
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must include at least one uppercase letter";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must include at least one lowercase letter";
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

    try {
      let uploadedImageUrl: string | undefined = undefined;
      if (imageFile) {
        uploadedImageUrl = await uploadToImgBB(imageFile);
      }

      const callbackUrl = role === "vendor" ? "/dashboard/vendor" : "/";

      // Better Auth signup with custom role and profile image
      const res = await authClient.signUp.email({
        name: fullName.trim(),
        email: email.trim(),
        password,
        image: uploadedImageUrl,
        // @ts-expect-error additionalFields role property
        role,
        callbackURL: callbackUrl,
      });

      if (res.error) {
        setErrors({ general: res.error.message || "Failed to create account. Please try again." });
        setIsLoading(false);
        return;
      }

      // Redirect user according to role
      router.push(callbackUrl);
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
      const callbackUrl = role === "vendor" ? "/dashboard/vendor" : "/";
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
          Create your WedPlan account
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Plan your dream wedding with ease. Get started today!
        </p>
      </div>

      {/* General Error Alert */}
      {errors.general && (
        <div className="mt-6 p-3 rounded-lg bg-status-rejected-bg text-status-rejected-text text-sm">
          {errors.general}
        </div>
      )}

      {/* Sign-up Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isLoading}
            className={`w-full h-11 px-3.5 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.fullName
                ? "border-destructive focus:ring-destructive/20"
                : "border-border focus:border-primary focus:ring-primary/20"
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
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
              placeholder="Create a password"
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
          {errors.password ? (
            <p className="text-xs text-destructive mt-1">{errors.password}</p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              At least 6 characters, one uppercase and one lowercase letter
            </p>
          )}
        </div>

        {/* Profile Image (Optional) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Profile Image (Optional)
          </label>
          {imagePreview ? (
            <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover border border-border"
                />
                <span className="text-xs text-foreground font-medium truncate max-w-50">
                  {imageFile?.name}
                </span>
              </div>
              <button
                type="button"
                onClick={removeImage}
                className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors"
                title="Remove image"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="profileImageInput"
              className="flex flex-col items-center justify-center p-4 border border-dashed border-border rounded-lg bg-card hover:bg-secondary/20 cursor-pointer transition-colors group"
            >
              <UploadCloud className="size-6 text-primary mb-1 group-hover:scale-105 transition-transform" />
              <span className="text-xs font-medium text-foreground">
                Click to upload or drag and drop
              </span>
              <span className="text-[11px] text-muted-foreground mt-0.5">
                JPG, PNG or WEBP (Max 5MB)
              </span>
              <input
                id="profileImageInput"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageChange}
                disabled={isLoading}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Account Role Selector */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Account Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Customer Role Card */}
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                role === "customer"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-secondary/20"
              }`}
            >
              {/* Radio Dot */}
              <div
                className={`size-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  role === "customer" ? "border-primary" : "border-border"
                }`}
              >
                {role === "customer" && (
                  <div className="size-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-medium text-sm text-foreground">
                  <User className="size-4 text-primary" />
                  <span>Customer</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Plan your wedding
                </p>
              </div>
            </button>

            {/* Vendor Role Card */}
            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                role === "vendor"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-secondary/20"
              }`}
            >
              {/* Radio Dot */}
              <div
                className={`size-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                  role === "vendor" ? "border-primary" : "border-border"
                }`}
              >
                {role === "vendor" && (
                  <div className="size-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-medium text-sm text-foreground">
                  <Store className="size-4 text-primary" />
                  <span>Vendor</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Offer your services
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-full text-sm transition-colors shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="size-4 animate-spin" />}
          <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
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

      {/* Footer Sign-in Link */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="text-primary hover:underline font-medium"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
