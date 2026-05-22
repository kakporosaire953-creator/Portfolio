import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  try {
    // Set SendGrid API key from env
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    const data = await request.formData();
    const name = data.get('name')?.toString() ?? '';
    const email = data.get('email')?.toString() ?? '';
    const message = data.get('message')?.toString() ?? '';

    const msg = {
      to: process.env.CONTACT_RECIPIENT!,
      from: 'no-reply@rosaier.dev',
      subject: 'Nouveau message de contact',
      html: `<p><strong>Nom :</strong> ${name}</p>
             <p><strong>Email :</strong> ${email}</p>
             <p><strong>Message :</strong> ${message}</p>`,
    };
    await sgMail.send(msg);
    return NextResponse.json({ status: 'ok', message: 'Message sent.' }, { status: 200 });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to process.' }, { status: 500 });
  }
}
