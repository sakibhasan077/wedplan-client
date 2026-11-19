"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImagePlus, Info, UploadCloud } from "lucide-react";
import Link from "next/link";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import { useState } from "react";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

type FormErrors = {
  serviceName?: string;
  category?: string;
  description?: string;
  price?: string;
  location?: string;
  image?: string;
};

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = ["image/jpeg", "image/png"];

export default function AddServicePage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState("");

  const selectImage = (file?: File) => {
    if (!file) return;

    setFormMessage("");

    if (!allowedImageTypes.includes(file.type)) {
      setImageFile(null);
      setErrors((current) => ({
        ...current,
        image: "Choose a PNG or JPG image.",
      }));
      return;
    }

    if (file.size > maxImageSize) {
      setImageFile(null);
      setErrors((current) => ({
        ...current,
        image: "Image must be 5 MB or smaller.",
      }));
      return;
    }

    setImageFile(file);
    setErrors((current) => ({ ...current, image: undefined }));
    setFormMessage("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectImage(event.target.files?.[0]);
  };

  const handleImageDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    selectImage(event.dataTransfer.files[0]);
  };

  const uploadImageToImgbb = async (file: File) => {
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

    return result.data.display_url;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage("");

    const formData = new FormData(event.currentTarget);
    const serviceName = String(formData.get("serviceName") ?? "").trim();
    const category = String(formData.get("category") ?? "");
    const description = String(formData.get("description") ?? "").trim();
    const priceValue = String(formData.get("price") ?? "");
    const location = String(formData.get("location") ?? "").trim();
    const price = Number(priceValue);
    const nextErrors: FormErrors = {};

    if (serviceName.length < 3) {
      nextErrors.serviceName =
        "Enter a service name with at least 3 characters.";
    }

    if (!categories.includes(category)) {
      nextErrors.category = "Select a service category.";
    }

    if (description.length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    }

    if (!priceValue || !Number.isFinite(price) || price <= 0) {
      nextErrors.price = "Enter a price greater than 0 BDT.";
    }

    if (location.length < 2) {
      nextErrors.location = "Enter a location with at least 2 characters.";
    }

    if (!imageFile) {
      nextErrors.image = "Choose a PNG or JPG image up to 5 MB.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setFormMessage(
      "All fields are valid, but this service was not saved because the service API is not connected yet.",
    );

    if (!imageFile) {
      return;
    }

    const imageUrl = await uploadImageToImgbb(imageFile);

    console.log(imageUrl);
  };

  const fieldClassName =
    "mt-2 h-10 rounded-lg border-border bg-background focus-visible:ring-primary";
  const labelClassName = "text-sm font-medium text-foreground";
  const errorClassName = "mt-1 text-sm text-destructive";

  return (
    <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8 overflow-hidden">
      <Card className="border border-border bg-card shadow-sm ring-0">
        <CardHeader className="px-5 pt-5 sm:px-7 sm:pt-7">
          <CardTitle className="font-heading text-2xl sm:text-3xl">
            Add a New Service
          </CardTitle>
          <CardDescription>
            Share the details of your wedding service with customers.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-5 pb-5 sm:px-7 sm:pb-7">
          <form
            onSubmit={handleSubmit}
            onChange={() => setFormMessage("")}
            noValidate
            className="space-y-6"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="serviceName" className={labelClassName}>
                  Service Name <span className="text-primary">*</span>
                </label>
                <Input
                  id="serviceName"
                  name="serviceName"
                  required
                  minLength={3}
                  placeholder="e.g. Wedding Photography"
                  aria-invalid={Boolean(errors.serviceName)}
                  aria-describedby={
                    errors.serviceName ? "serviceName-error" : undefined
                  }
                  className={fieldClassName}
                />
                {errors.serviceName && (
                  <p id="serviceName-error" className={errorClassName}>
                    {errors.serviceName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="category" className={labelClassName}>
                  Service Category <span className="text-primary">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  defaultValue=""
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={
                    errors.category ? "category-error" : undefined
                  }
                  className={`${fieldClassName} w-full px-3 text-sm`}
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((categoryOption) => (
                    <option key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className={errorClassName}>
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className={labelClassName}>
                  Description <span className="text-primary">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Describe your service, packages, and what makes it special."
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                />
                {errors.description && (
                  <p id="description-error" className={errorClassName}>
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="location" className={labelClassName}>
                  Location <span className="text-primary">*</span>
                </label>
                <Input
                  id="location"
                  name="location"
                  required
                  minLength={2}
                  placeholder="e.g. Dhaka, Bangladesh"
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={
                    errors.location ? "location-error" : undefined
                  }
                  className={fieldClassName}
                />
                {errors.location && (
                  <p id="location-error" className={errorClassName}>
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="price" className={labelClassName}>
                  Price (BDT) <span className="text-primary">*</span>
                </label>
                <div className="mt-2 flex h-10 overflow-hidden rounded-lg border border-border bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                  <span className="flex items-center border-r border-border px-3 text-sm text-muted-foreground">
                    ৳
                  </span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    min="1"
                    step="1"
                    placeholder="15,000"
                    aria-invalid={Boolean(errors.price)}
                    aria-describedby={errors.price ? "price-error" : undefined}
                    className="h-full rounded-none border-0 bg-transparent focus-visible:border-0 focus-visible:ring-0"
                  />
                </div>
                {errors.price && (
                  <p id="price-error" className={errorClassName}>
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClassName} htmlFor="serviceImage">
                Service Image <span className="text-primary">*</span>
              </label>
              <label
                htmlFor="serviceImage"
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleImageDrop}
                className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background px-4 py-6 text-center transition-colors hover:bg-secondary/40"
              >
                <Input
                  id="serviceImage"
                  name="serviceImage"
                  type="file"
                  accept="image/png,image/jpeg"
                  required
                  aria-invalid={Boolean(errors.image)}
                  aria-describedby={errors.image ? "image-error" : "image-help"}
                  onChange={handleImageChange}
                  className="sr-only"
                />
                {imageFile ? (
                  <>
                    <ImagePlus
                      className="mb-2 size-7 text-primary"
                      aria-hidden="true"
                    />
                    <span className="max-w-full truncate text-sm font-medium">
                      {imageFile.name}
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      Click or drop another image to replace it
                    </span>
                    <span id="image-help" className="sr-only">
                      PNG or JPG, up to 5 MB
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud
                      className="mb-2 size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">
                      Drag and drop an image here or{" "}
                      <span className="text-primary">browse files</span>
                    </span>
                    <span
                      id="image-help"
                      className="mt-1 text-xs text-muted-foreground"
                    >
                      PNG or JPG, up to 5 MB
                    </span>
                  </>
                )}
              </label>
              {errors.image && (
                <p id="image-error" className={errorClassName}>
                  {errors.image}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Info
                className="mt-0.5 size-4 shrink-0 text-gold"
                aria-hidden="true"
              />
              <p>
                Your service will be reviewed by an admin before it appears
                publicly.
              </p>
            </div>

            {formMessage && (
              <p
                role="status"
                className="rounded-lg border border-gold/40 bg-gold-muted px-3 py-2 text-sm text-foreground"
              >
                {formMessage}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <Button
                nativeButton= {false}
                type="button"
                variant="outline"
                render={<Link href="/dashboard/vendor/services" />}
                className="h-10 w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" className="h-10 w-full sm:w-auto">
                Submit for Review
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
