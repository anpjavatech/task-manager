// Recovery code : K1YFLN5XGPKXL4WGAT1DGC8N

import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export default function sendWelcomeEmail(email, name){

    sgMail
    .send({
        to: email, // Change to your recipient
        from: 'anoop.ks007@gmail.com', // Change to your verified sender
        subject: 'Thanks for joining in !.',
        text: `Welcomw to the app ${name}. Let me know how you get along with the app.`
      })

}

export function sendCancellationEmail(email, name){

  sgMail
  .send({
      to: email, // Change to your recipient
      from: 'anoop.ks007@gmail.com', // Change to your verified sender
      subject: 'Sorry to see you go !.',
      text: `Goodbye, ${name}.`
    })

}