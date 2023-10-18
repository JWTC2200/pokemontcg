import EmailTemplate from '@/components/EmailTemplate';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.FROM_EMAIL!
const contact = process.env.CONTACT_EMAIL!

export async function POST(req:NextRequest ) {
  const props = await req.json()
  try {
    const data = await resend.emails.send({
      from: 'pokemon@jwtc2200.com',
      to: [contact,],
      subject: 'PokemonTCG Feedback',
      react: EmailTemplate(props) as React.ReactElement,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}
