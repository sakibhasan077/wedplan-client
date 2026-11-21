import { paymentVerify } from '@/lib/actions/payment'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Check, Crown } from 'lucide-react'

export default async function SuccessPage({ searchParams }:{ searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (session.status === 'open') {
    return redirect('/')
  }

  if (session.status === 'complete' && session.payment_status === 'paid') {
    await paymentVerify(session_id)

    const date = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(session.created * 1000))

    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-background p-4">
        <section
          id="success"
          className="w-full max-w-[434px] rounded-md border border-[#dfdfdc] bg-white px-5 pb-4 pt-5 text-center shadow-[0_1px_4px_rgba(48,43,43,0.16)]"
        >
          <div className="mx-auto flex size-14 items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full border-[3px] border-[#78b8a8] text-[#58a391]">
              <Check className="size-6 stroke-[3]" aria-hidden="true" />
            </span>
          </div>

          <h1 className="mt-3 font-heading text-[20px] font-semibold leading-tight text-[#302b2b]">
            Welcome to WedPlan Premium!
          </h1>

          <p className="mx-auto mt-2 max-w-[355px] text-[11px] leading-[1.55] text-[#9b9b9b]">
            Your Stripe payment is verified, your transaction is recorded, and
            your Premium vendor benefits are now active
          </p>

          <div className="mt-4 rounded-[5px] border border-[#ecebea] bg-[#fdfdfc] px-3 py-2.5 text-left">
            <dl className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <dt className="text-[#8d8d8d]">Plan</dt>
                <dd className="flex items-center gap-1 font-semibold text-[#302b2b]">
                  <Crown className="size-3 text-[#b89a62]" aria-hidden="true" />
                  Premium
                </dd>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <dt className="text-[#8d8d8d]">Amount</dt>
                <dd className="font-semibold text-[#302b2b]">$29</dd>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <dt className="text-[#8d8d8d]">Transaction Status</dt>
                <dd className="font-medium text-[#63a693]">Completed</dd>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <dt className="text-[#8d8d8d]">Date</dt>
                <dd className="font-medium text-[#302b2b]">{date}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link
              href="/dashboard/vendor/subscription"
              className="flex h-9 items-center justify-center rounded-md bg-[#a94b57] text-[11px] font-semibold text-white transition-colors hover:bg-[#963f4a]"
            >
              View Subscription
            </Link>
            <Link
              href="/dashboard/vendor/services/add"
              className="flex h-9 items-center justify-center rounded-md bg-[#ededeb] text-[11px] font-medium text-[#57524f] transition-colors hover:bg-[#e4e3e0]"
            >
              Publish a Service
            </Link>
          </div>
        </section>
      </main>
    )
  }
}