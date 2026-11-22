import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Banner() {
  return (
    <section className="relative isolate min-h-130 overflow-hidden sm:min-h-140 lg:min-h-155">
      <Image
        src="/images/banner-bg.jpg"
        alt="A couple celebrating their wedding"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[58%_center]"
      />

      <div className="absolute inset-0 bg-linear-to-r from-warm-ivory/95 via-warm-ivory/75 to-transparent max-sm:from-warm-ivory/90 max-sm:to-warm-ivory/25" />

      <div className="relative mx-auto flex min-h-130 max-w-7xl items-center px-6 sm:min-h-140 sm:px-8 lg:min-h-155 lg:px-12">
        <div className="max-w-175 py-12">
          <h1 className="text-[clamp(2.75rem,6vw,4.25rem)] leading-[0.98] text-foreground">
            <span className="block min-[1200px]:whitespace-nowrap">
              Plan Your Perfect
            </span>
            <span className="block min-[1200px]:whitespace-nowrap">
              Wedding, Beautifully
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-foreground/80 sm:text-lg sm:leading-8">
            Discover trusted wedding venues and vendors, and bring every detail
            of your celebration together in one place.
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-sans text-base font-medium text-primary-foreground shadow-lg shadow-primary/15 transition-colors hover:bg-primary-hover"
          >
            Explore Wedding Services
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}