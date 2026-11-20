"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Service } from "@/types/type";
import { updateServices } from "@/lib/actions/services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

type EditServiceFormProps = {
  service: Service;
};

export default function EditServiceForm({ service }: EditServiceFormProps) {
  const [imagePreview, setImagePreview] = useState(service.imageUrl);
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter()
  useEffect(() => {
    if (!imagePreview || imagePreview === service.imageUrl) {
      return;
    }

    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview, service.imageUrl]);

  // image change
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("Choose a PNG or JPG image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setMessage("");
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  // image bb upload
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Image upload failed");
    }

    return result.data.url;
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const imageUrl = imageFile ? await uploadImage(imageFile) : imagePreview;
      const result = await updateServices(service._id, { imageUrl, ...data });

      if (result.modifiedCount) {
        toast.success("Service updated successfully!");
        router.push("/dashboard/vendor/services");
      } else {
        toast.error("Failed to update service. Please try again.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update service. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const fieldClassName =
    "mt-2 h-10 rounded-lg border-border bg-background focus-visible:ring-primary";
  const labelClassName = "text-sm font-medium text-foreground";

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <Card className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl flex-col border border-border bg-card shadow-sm ring-0">
        <CardHeader className="px-5 pt-5 sm:px-7 sm:pt-7">
          <CardTitle className="font-heading text-2xl sm:text-3xl">
            Edit Service
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your service details and keep your listing current.
          </p>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col px-5 pb-5 sm:px-7 sm:pb-7">
          <form
            onSubmit={handleSubmit}
            onChange={() => setMessage("")}
            className="flex flex-1 flex-col"
          >
            <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
              <div>
                <label htmlFor="serviceName" className={labelClassName}>
                  Service Name <span className="text-primary">*</span>
                </label>
                <Input
                  id="serviceName"
                  name="serviceName"
                  defaultValue={service.serviceName}
                  required
                  minLength={3}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="category" className={labelClassName}>
                  Service Category <span className="text-primary">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  defaultValue={service.category}
                  required
                  className={`${fieldClassName} w-full px-3 text-sm`}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className={labelClassName}>
                  Description <span className="text-primary">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={service.description}
                  required
                  minLength={10}
                  maxLength={500}
                  rows={3}
                  className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  Up to 500 characters
                </p>
              </div>

              <div>
                <label htmlFor="price" className={labelClassName}>
                  Price (BDT) <span className="text-primary">*</span>
                </label>
                <div className="mt-2 flex h-10 overflow-hidden rounded-lg border border-border bg-background focus-within:ring-3 focus-within:ring-ring/50">
                  <span className="flex items-center border-r border-border px-3 text-sm text-muted-foreground">
                    ৳
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    defaultValue={service.price}
                    required
                    className="h-full rounded-none border-0 bg-transparent focus-visible:border-0 focus-visible:ring-0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className={labelClassName}>
                  Location <span className="text-primary">*</span>
                </label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={service.location}
                  required
                  minLength={2}
                  className={fieldClassName}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClassName} htmlFor="serviceImage">
                  Service Image
                </label>
                <div className="mt-2 flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-background p-2">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Service preview"
                        fill
                        unoptimized
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <label
                    htmlFor="serviceImage"
                    className="flex min-h-20 flex-1 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border px-3 py-2 text-center transition-colors hover:bg-secondary/50"
                  >
                    <UploadCloud
                      className="size-5 text-primary"
                      aria-hidden="true"
                    />
                    <span className="mt-1 text-sm font-medium">
                      Replace image
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG up to 5 MB
                    </span>
                    <Input
                      id="serviceImage"
                      name="serviceImage"
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </div>

            {message && (
              <p
                role="status"
                className="mt-5 rounded-lg border border-gold/40 bg-gold-muted px-3 py-2 text-sm text-foreground"
              >
                {message}
              </p>
            )}

            <div className="mt-auto flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                nativeButton={false}
                variant="outline"
                disabled={isSaving}
                render={<Link href="/dashboard/vendor/services" />}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
