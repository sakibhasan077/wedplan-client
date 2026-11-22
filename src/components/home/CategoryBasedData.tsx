"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Flower2,
  Heart,
  Landmark,
  Shirt,
  Utensils,
  WandSparkles,
} from "lucide-react";
import { motion } from "motion/react";

const categories = [
  {
    name: "Photography & Videography",
    image: "/images/category-1.jfif",
    icon: Camera,
    accent: "text-primary",
  },
  {
    name: "Wedding Venues",
    image: "/images/category-2.png",
    icon: Landmark,
    accent: "text-gold",
  },
  {
    name: "Decoration & Florist",
    image: "/images/category-3.webp",
    icon: Flower2,
    accent: "text-primary",
  },
  {
    name: "Catering Services",
    image: "/images/category-4.webp",
    icon: Utensils,
    accent: "text-gold",
  },
  {
    name: "Makeup & Styling",
    image: "/images/category-5.webp",
    icon: WandSparkles,
    accent: "text-primary",
  },
  {
    name: "Wedding Fashion",
    image: "/images/category-6.webp",
    icon: Shirt,
    accent: "text-gold",
  },
];

export default function CategoryBasedData() {
  return (
    <section className="bg-warm-ivory px-4 py-14 sm:px-8 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-3 text-gold">
            <span className="h-px w-14 bg-gold/70" />
            <Heart className="size-5" aria-hidden="true" />
            <span className="h-px w-14 bg-gold/70" />
          </div>
          <h2 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Explore Wedding Categories
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Find the perfect professionals for every part of your celebration.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const CategoryIcon = category.icon;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
              >
                <Link
                  href={`/services?category=${encodeURIComponent(category.name)}`}
                  className="group block h-full overflow-hidden rounded-xl border border-border/80 bg-card p-1.5 shadow-sm transition-[border-color,box-shadow] hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="relative aspect-[1.65] overflow-hidden rounded-lg">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="px-2.5 pt-3 pb-2.5">
                    <CategoryIcon
                      aria-hidden="true"
                      className={`size-6 ${category.accent}`}
                      strokeWidth={1.6}
                    />
                    <h3 className="mt-2 font-heading text-lg font-semibold leading-tight text-foreground">
                      {category.name}
                    </h3>
                    <span
                      className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${category.accent}`}
                    >
                      Explore services
                      <span
                        aria-hidden="true"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}