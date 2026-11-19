"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    title: "Find a Service",
    description: "Explore wedding services by category and location.",
    image: "/images/works-icon-1.png",
  },
  {
    title: "Compare Vendors",
    description: "Review service details, pricing, and vendor information.",
    image: "/images/works-icon-2.png",
  },
  {
    title: "Send a Booking Request",
    description: "Choose a service and share your event details.",
    image: "/images/works-icon-3.png",
  },
  {
    title: "Plan Your Celebration",
    description: "Track your booking and hear back from the vendor.",
    image: "/images/works-icon-4.png",
  },
];

export default function HowWorks() {
  return (
    <section className="bg-background px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl text-foreground sm:text-5xl">
            How WedPlan Works
          </h2>
          <p className="mt-4 text-base text-foreground/75 sm:text-lg">
            Four simple steps to plan a celebration you&apos;ll remember.
          </p>
        </div>

        <div className="relative mt-10 mb-3 hidden grid-cols-4 items-center lg:grid">
          <div className="absolute top-1/2 right-[12.5%] left-[12.5%] h-0.5 -translate-y-1/2 bg-gold/50" />
          {steps.map((step, index) => (
            <div key={step.title} className="z-10 flex justify-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
                {index + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4 lg:gap-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <span className="absolute -top-4 left-1/2 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-primary text-base text-primary-foreground lg:hidden">
                {index + 1}
              </span>
              <Card className="min-h-80 items-center gap-0 rounded-2xl border border-border/80 bg-card px-5 pt-9 pb-7 text-center shadow-[0_2px_12px_rgba(48,43,43,0.06)] lg:pt-7">
                <Image
                  src={step.image}
                  alt=""
                  width={180}
                  height={100}
                  className="h-24 w-44 object-contain"
                />
                <h3 className="mt-4 text-2xl leading-tight">{step.title}</h3>
                <p className="mt-4 max-w-52 text-base leading-7 text-foreground/80">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}