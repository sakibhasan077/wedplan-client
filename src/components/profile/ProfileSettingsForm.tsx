"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Camera, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientSession } from "@/lib/core/client-session";
import { UpdateUsersProfile } from "@/lib/actions/users";

const ProfileSettingsFormContent = () => {
  const { session } = useClientSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  console.log(session);
  const [fullName, setFullName] = useState(
    () => session?.user.name || "",
  );
  const [email] = useState(() => session?.user.email || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [businessName, setBusinessName] = useState(() =>
    "businessName" in (session?.user ?? {})
      ? String(session?.user.businessName || "")
      : "",
  );
  const [about, setAbout] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(
    () => session?.user.image || "",
  );
  const [isSaving, setIsSaving] = useState(false);


  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return session?.user.image || undefined;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("Image upload is not configured.");
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      },
    );
    const result = await response.json();

    if (!response.ok || !result?.data?.url) {
      throw new Error("Failed to upload profile image.");
    }

    return result.data.url as string;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!session?.user.id) {
      toast.error("Please sign in again.");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }

    setIsSaving(true);

    try {
      const image = await uploadImage();
      await UpdateUsersProfile(session.user.id, {
        name: fullName.trim(),
        businessName: businessName.trim(),
        image,
        phoneNumber,
        city,
        about
      });
      toast.success("Profile updated successfully.");
      setImageFile(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
      const message =
        error instanceof Error ? error.message : "Failed to update profile.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const role =
    "role" in (session?.user ?? {})
      ? String(session?.user.role || "customer")
      : "customer";
  const subscriptionPlan =
    "subscriptionPlan" in (session?.user ?? {})
      ? String(session?.user.subscriptionPlan || "free")
      : "free";

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="flex items-center gap-4">
          <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary/40 bg-muted text-lg font-semibold text-primary">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile photo"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              fullName.charAt(0).toUpperCase() || "U"
            )}
            <button
              type="button"
              aria-label="Upload profile photo"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground"
            >
              <Camera className="size-2.5" />
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold">Profile photo</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              JPG, PNG or WebP. Up to 5 MB. Your photo appears in the navbar and
              on your bookings.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="hidden sm:inline-flex"
          >
            Upload new photo
          </Button>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-4 text-sm font-semibold">Personal information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium">
            Full name
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1.5"
            />
          </label>

          <label className="text-xs font-medium">
            Email
            <div className="relative mt-1.5">
              <Input value={email} readOnly className="pr-8" />
              <LockKeyhole className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </label>

          <label className="text-xs font-medium">
            Phone number
            <Input
              type="tel"
              value={phoneNumber}
              // defaultValue={}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+880 XXXX XXXXXX"
              className="mt-1.5"
            />
          </label>

          <label className="text-xs font-medium">
            City
            <Input
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="e.g. Dhaka"
              className="mt-1.5"
            />
          </label>

          {role === "vendor" && (
            <label className="text-xs font-medium sm:col-span-2">
              Business name
              <Input
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="e.g. Sakib Photography"
                className="mt-1.5"
              />
            </label>
          )}

          <label className="text-xs font-medium sm:col-span-2">
            About
            <textarea
              value={about}
              onChange={(event) => setAbout(event.target.value)}
              placeholder="Tell couples about your work and experience"
              className="mt-1.5 min-h-24 w-full resize-y rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <LockKeyhole className="size-4 text-muted-foreground" />
          Account
        </h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs sm:max-w-md">
          <span className="font-medium">Role</span>
          <span className="text-muted-foreground">{role}</span>
          <span className="font-medium">Subscription plan</span>
          <span className="text-muted-foreground">{subscriptionPlan}</span>
        </div>

        {role === "vendor" && (
          <p className="mt-3 text-xs text-muted-foreground">
            Your role and subscription are managed by WedPlan and cannot be
            changed from this page.
          </p>
        )}
      </section>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="animate-spin" />}
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

const ProfileSettingsForm = () => {
  const { session, isPending } = useClientSession();

  if (isPending || !session?.user) {
    return (
      <div className="mt-5 space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return <ProfileSettingsFormContent />;
};

export default ProfileSettingsForm;