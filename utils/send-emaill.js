// Import predefined email templates (subject + body generators)
import { emailTemplates } from "./email-template.js";

// Day.js is used to format dates in a human-readable way
import dayjs from "dayjs";

// Nodemailer transporter instance and sender email address
import transporter, { accountEmail } from "../config/nodemailer.js";

// Sends a subscription reminder email based on the given template type
export const sendReminderEmail = async ({to, type, subscription}) => {

    // Validate required parameters before proceeding -> to: 'user@gmail.com', type: 'UPCOMING_RENEWAL'
    if(!to || !type) throw new Error('Missing required parameters');

    // Select the correct email template based on reminder type
    const template = emailTemplates.find((t) => t.label === type);
    
    // Throw error if no matching template is found
    if(!template) throw new Error('Invalid Email Type');

    // Data object passed to the email template for dynamic content
    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod: subscription.paymentMethod,
    }

    // Generate email body and subject using the selected template
    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

     // Email configuration object for Nodemailer
    const mailOptions = {
        from: accountEmail,
        to: to,
        subject: subject,
        html: message,
    }
    // Send email using Nodemailer transporter
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) return console.log(error, 'Error sending Email');

        console.log('Email sent: '+ info.response)
    })
}