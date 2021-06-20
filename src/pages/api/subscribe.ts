import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";

import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if(req.method !== "POST"){
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');

        return res;
    } 

    // primeiro criar usuario no strape
    const session = await getSession({ req }); //buscando usuario com o cookie da req no session do nextjs

    const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        // metadata
    })

    // criando checkoout session
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomer.id,
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        line_items: [
            { price: 'price_1J4T32HY80b2tVy9vAnPittL', quantity: 1 }
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_CANCEL_URL
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession.id })
}