import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <div className="pointer-events-none absolute bottom-0 left-0 hidden h-36 w-36 text-gold/45 md:block">
        <svg viewBox="0 0 144 144" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M8 138C43 112 67 74 75 12" />
            <path d="M28 121C17 112 14 101 14 91C24 95 31 103 28 121Z" />
            <path d="M43 107C31 94 31 82 33 70C44 77 49 89 43 107Z" />
            <path d="M55 90C46 77 48 64 52 53C61 62 64 75 55 90Z" />
            <path d="M64 69C59 57 64 46 70 38C76 48 75 59 64 69Z" />
            <path d="M29 121C41 121 52 116 58 108C48 104 37 108 29 121Z" />
            <path d="M44 106C57 108 68 103 76 94C64 91 53 95 44 106Z" />
            <path d="M56 89C69 91 78 85 85 76C73 74 63 77 56 89Z" />
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute right-0 bottom-0 hidden h-36 w-36 -rotate-90 text-gold/45 md:block">
        <svg viewBox="0 0 144 144" fill="none" aria-hidden="true">
          <g stroke="currentColor" strokeWidth="1.5">
            <path d="M8 138C43 112 67 74 75 12" />
            <path d="M28 121C17 112 14 101 14 91C24 95 31 103 28 121Z" />
            <path d="M43 107C31 94 31 82 33 70C44 77 49 89 43 107Z" />
            <path d="M55 90C46 77 48 64 52 53C61 62 64 75 55 90Z" />
            <path d="M64 69C59 57 64 46 70 38C76 48 75 59 64 69Z" />
            <path d="M29 121C41 121 52 116 58 108C48 104 37 108 29 121Z" />
            <path d="M44 106C57 108 68 103 76 94C64 91 53 95 44 106Z" />
            <path d="M56 89C69 91 78 85 85 76C73 74 63 77 56 89Z" />
          </g>
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-12 pb-8 sm:px-8 lg:px-12 lg:pt-16">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:grid-cols-[1.45fr_1fr_1.25fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/images/logo.png"
                alt="WedPlan"
                width={160}
                height={45}
                className="h-16 w-auto object-contain"
              />
            </Link>
            <p className="mt-5 max-w-xs text-base leading-8 text-foreground/75">
              Your trusted partner for planning
              <br className="hidden sm:block" /> a celebration to remember.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-[23px] font-semibold text-foreground">Quick Links</h2>
            <nav aria-label="Footer navigation" className="mt-6 space-y-4">
              <Link
                href="/"
                className="block text-base text-foreground/80 transition-colors hover:text-primary"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="block text-base text-foreground/80 transition-colors hover:text-primary"
              >
                Browse Services
              </Link>
              <Link
                href="/sign-in"
                className="block text-base text-foreground/80 transition-colors hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="block text-base text-foreground/80 transition-colors hover:text-primary"
              >
                Sign Up
              </Link>
            </nav>
          </div>

          <div>
            <h2 className="font-heading text-[23px] font-semibold text-foreground">Contact Us</h2>
            <div className="mt-6 space-y-5">
              <Link
                href="mailto:sakibhasanmd077@gamil.com"
                className="flex items-center gap-4 text-base text-foreground/80 transition-colors hover:text-primary"
              >
                <Mail className="size-6 shrink-0 text-gold" aria-hidden="true" />
                sakibhasanmd077@gamil.com
              </Link>
              <Link
                href="tel:+8801780696376"
                className="flex items-center gap-4 text-base text-foreground/80 transition-colors hover:text-primary"
              >
                <Phone className="size-6 shrink-0 text-gold" aria-hidden="true" />
                +880 1780-696376
              </Link>
              <p className="flex items-center gap-4 text-base text-foreground/80">
                <MapPin className="size-6 shrink-0 text-gold" aria-hidden="true" />
                Dinajpur, Bangladesh
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-heading text-[23px] font-semibold text-foreground">Follow Us</h2>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <FaInstagram className="size-5" />
              </Link>
              <Link
                href="https://www.facebook.com/sakibhasan077"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <FaFacebookF className="size-5" />
              </Link>
              <Link
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Pinterest"
                className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <FaPinterestP className="size-5" />
              </Link>
              <Link
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <FaYoutube className="size-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-7 text-center text-base text-muted-foreground md:mt-16">
          <p>&copy; 2026 WedPlan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}