import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { getServerSession } from '@/lib/core/server-session';

export async function POST() {
  const userSession = await getServerSession()
  const userEmail = userSession?.user.email;
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UeBGLBoNWCsqMq8Dskm977b',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userEmail ,
      metadata:{
        vendorId: userSession?.user.id as string,
        vendorName: userSession?.user.name as string,
        vendorEmail: userSession?.user.email as string,
      },
      success_url: `${origin}/dashboard/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
      integration_identifier: 'Wed_Plan',
    });
    return NextResponse.redirect(session.url as string, 303)
  } catch (err) {
    const error = err as { message: string; statusCode?: number };
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    )
  }
}