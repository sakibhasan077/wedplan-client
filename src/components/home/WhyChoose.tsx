"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Trusted Vendors",
    description: "Find reviewed wedding professionals for every part of your day.",
    image: "/images/choose-1.png",
  },
  {
    title: "Easy Booking",
    description: "Compare services and send booking requests with confidence.",
    image: "/images/choose-2.png",
  },
  {
    title: "Plan in One Place",
    description: "Keep your vendors and booking details organized together.",
    image: "/images/choose-3.png",
  },
  {
    title: "Made for Your Day",
    description: "Discover venues and services that fit your style and location.",
    image: "/images/choose-4.png",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-background px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl text-foreground sm:text-5xl">
            Why Choose WedPlan?
          </h2>
          <p className="mt-4 text-base text-foreground/75 sm:text-lg">
            Everything you need to plan your celebration, all in one place.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <Card className="min-h-80 items-center gap-0 rounded-2xl border border-border/80 bg-card px-5 py-7 text-center shadow-[0_2px_12px_rgba(48,43,43,0.06)]">
                <Image
                  src={feature.image}
                  alt=""
                  width={180}
                  height={100}
                  className="h-24 w-44 object-contain"
                />
                <h3 className="mt-4 text-2xl leading-tight">
                  {feature.title}
                </h3>
                <p className="mt-4 max-w-52 text-base leading-7 text-foreground/80">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}