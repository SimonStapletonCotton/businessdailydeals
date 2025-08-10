import { MailService } from '@sendgrid/mail';

const mailService = new MailService();

if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY not configured');
      return false;
    }

    await mailService.send({
      to: params.to,
      from: params.from || 'noreply@businessdailydeals.co.za',
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

interface DealRequestEmailData {
  requesterName: string;
  requesterEmail: string;
  productName: string;
  productSize?: string;
  quantityRequired: number;
  deliveryDestination: string;
  priceRangeMin?: number;
  priceRangeMax?: number;
  additionalRequirements?: string;
  submittedAt: string;
}

interface InquiryEmailData {
  buyerName: string;
  buyerEmail: string | null;
  supplierName: string;
  supplierEmail: string | null;
  dealTitle: string;
  dealPrice: string;
  inquiryMessage: string;
  submittedAt: string;
}

export async function sendInquiryNotifications(inquiryData: InquiryEmailData): Promise<boolean> {
  const adminEmail = 'admin@businessdailydeals.co.za';
  const fromEmail = 'noreply@businessdailydeals.co.za';
  
  // Email content for supplier
  const supplierEmailContent = `
New Inquiry for Your Deal
=========================

Dear ${inquiryData.supplierName},

You have received a new inquiry for your deal "${inquiryData.dealTitle}".

Deal Details:
- Product: ${inquiryData.dealTitle}
- Price: ${inquiryData.dealPrice}

Buyer Information:
- Name: ${inquiryData.buyerName}
- Email: ${inquiryData.buyerEmail}

Inquiry Message:
${inquiryData.inquiryMessage || 'No additional message provided.'}

Please log into your supplier dashboard at www.businessdailydeals.co.za to respond to this inquiry.

Best regards,
Business Daily Deals Team
www.businessdailydeals.co.za
  `;

  // Email content for admin
  const adminEmailContent = `
New Inquiry Notification
========================

A new inquiry has been submitted on Business Daily Deals.

Deal Information:
- Product: ${inquiryData.dealTitle}
- Price: ${inquiryData.dealPrice}

Supplier Information:
- Name: ${inquiryData.supplierName}
- Email: ${inquiryData.supplierEmail}

Buyer Information:
- Name: ${inquiryData.buyerName}
- Email: ${inquiryData.buyerEmail}

Inquiry Message:
${inquiryData.inquiryMessage || 'No additional message provided.'}

Submitted: ${inquiryData.submittedAt}

This inquiry has been sent to the supplier and copied here for your records.
  `;

  let supplierSuccess = false;
  let adminSuccess = false;

  // Send to supplier (only if email exists)
  if (inquiryData.supplierEmail) {
    try {
      supplierSuccess = await sendEmail({
        to: inquiryData.supplierEmail,
        from: fromEmail,
        subject: `New inquiry for your deal: ${inquiryData.dealTitle}`,
        text: supplierEmailContent,
        html: supplierEmailContent.replace(/\n/g, '<br>')
      });
    } catch (error) {
      console.error('Failed to send inquiry email to supplier:', error);
    }
  }

  // Send copy to admin
  try {
    adminSuccess = await sendEmail({
      to: adminEmail,
      from: fromEmail,
      subject: `Inquiry Copy: ${inquiryData.dealTitle}`,
      text: adminEmailContent,
      html: adminEmailContent.replace(/\n/g, '<br>')
    });
  } catch (error) {
    console.error('Failed to send inquiry copy to admin:', error);
  }

  console.log(`Inquiry emails - Supplier: ${supplierSuccess ? 'sent' : 'failed'}, Admin: ${adminSuccess ? 'sent' : 'failed'}`);
  
  // Return true if at least one email was sent successfully
  return supplierSuccess || adminSuccess;
}

// Payment notification email data
interface PaymentNotificationData {
  customerName: string;
  customerEmail: string;
  packageType: string;
  credits: number;
  amount: string;
  paymentReference: string;
  merchantReference: string;
  paymentMethod: string; // 'PayFast EFT', 'PayFast Card', etc.
  paidAt: string;
}

export async function sendPaymentNotificationToAdmin(paymentData: PaymentNotificationData): Promise<boolean> {
  const adminEmail = 'admin@businessdailydeals.co.za';
  const fromEmail = 'noreply@businessdailydeals.co.za';

  const emailContent = `
Payment Successfully Processed
==============================

Payment Details:
- Amount: ${paymentData.amount}
- Payment Reference: ${paymentData.paymentReference}
- Merchant Reference: ${paymentData.merchantReference}
- Payment Method: ${paymentData.paymentMethod}
- Date/Time: ${paymentData.paidAt}

Customer Information:
- Name: ${paymentData.customerName}
- Email: ${paymentData.customerEmail}

Purchase Details:
- Package: ${paymentData.packageType}
- Credits Purchased: ${paymentData.credits}

This payment should appear in your Nedbank account within 24 hours.
Use the Merchant Reference (${paymentData.merchantReference}) to match with your bank statement.

Business Daily Deals Admin Panel
www.businessdailydeals.co.za
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #22c55e; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
        <h2 style="margin: 0; font-size: 24px;">💰 Payment Successfully Processed</h2>
        <p style="margin: 5px 0 0 0; opacity: 0.9;">Business Daily Deals</p>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; margin-bottom: 20px;">
          <h3 style="color: #15803d; margin-top: 0; font-size: 18px;">💳 Payment Details</h3>
          <div style="display: grid; gap: 8px;">
            <p style="margin: 0;"><strong>Amount:</strong> <span style="color: #15803d; font-size: 20px; font-weight: bold;">${paymentData.amount}</span></p>
            <p style="margin: 0;"><strong>Payment Reference:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${paymentData.paymentReference}</code></p>
            <p style="margin: 0;"><strong>Merchant Reference:</strong> <code style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${paymentData.merchantReference}</code></p>
            <p style="margin: 0;"><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
            <p style="margin: 0;"><strong>Date/Time:</strong> ${paymentData.paidAt}</p>
          </div>
        </div>

        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #92400e; margin-top: 0;">👤 Customer Information</h3>
          <p style="margin: 5px 0;"><strong>Name:</strong> ${paymentData.customerName}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${paymentData.customerEmail}</p>
        </div>

        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #1e40af; margin-top: 0;">📦 Purchase Details</h3>
          <p style="margin: 5px 0;"><strong>Package:</strong> ${paymentData.packageType}</p>
          <p style="margin: 5px 0;"><strong>Credits Purchased:</strong> <span style="color: #1e40af; font-weight: bold;">${paymentData.credits}</span></p>
        </div>

        <div style="background-color: #e0f2fe; padding: 15px; border-radius: 8px; border: 1px solid #0284c7;">
          <p style="margin: 0; color: #0c4a6e;"><strong>📱 Bank Reconciliation:</strong></p>
          <p style="margin: 5px 0 0 0; color: #0c4a6e;">This payment should appear in your Nedbank account within 24 hours.</p>
          <p style="margin: 5px 0 0 0; color: #0c4a6e;">Use reference: <strong>${paymentData.merchantReference}</strong> to match with your bank statement.</p>
        </div>
      </div>
    </div>
  `;

  return await sendEmail({
    to: adminEmail,
    from: fromEmail,
    subject: `💰 Payment Received: ${paymentData.amount} - ${paymentData.merchantReference}`,
    text: emailContent,
    html: htmlContent,
  });
}

export async function sendDealRequestToAdmin(dealRequestData: DealRequestEmailData): Promise<boolean> {
  const adminEmail = 'admin@businessdailydeals.co.za';
  const fromEmail = 'noreply@businessdailydeals.co.za';

  const priceRange = dealRequestData.priceRangeMin || dealRequestData.priceRangeMax 
    ? `R${dealRequestData.priceRangeMin || 0} - R${dealRequestData.priceRangeMax || 'unlimited'}`
    : 'Not specified';

  const emailContent = `
New Deal Request Received
========================

Customer Information:
- Name: ${dealRequestData.requesterName}
- Email: ${dealRequestData.requesterEmail}
- Submitted: ${dealRequestData.submittedAt}

Product Requirements:
- Product: ${dealRequestData.productName}
- Size/Specifications: ${dealRequestData.productSize || 'Not specified'}
- Quantity Required: ${dealRequestData.quantityRequired}
- Delivery Destination: ${dealRequestData.deliveryDestination}
- Price Range: ${priceRange}

Additional Requirements:
${dealRequestData.additionalRequirements || 'None specified'}

Please process this request and search for matching suppliers.
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #374151; border-bottom: 2px solid #374151; padding-bottom: 10px;">
        New Deal Request Received
      </h2>
      
      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Customer Information</h3>
        <p><strong>Name:</strong> ${dealRequestData.requesterName}</p>
        <p><strong>Email:</strong> ${dealRequestData.requesterEmail}</p>
        <p><strong>Submitted:</strong> ${dealRequestData.submittedAt}</p>
      </div>

      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #374151; margin-top: 0;">Product Requirements</h3>
        <p><strong>Product:</strong> ${dealRequestData.productName}</p>
        <p><strong>Size/Specifications:</strong> ${dealRequestData.productSize || 'Not specified'}</p>
        <p><strong>Quantity Required:</strong> ${dealRequestData.quantityRequired}</p>
        <p><strong>Delivery Destination:</strong> ${dealRequestData.deliveryDestination}</p>
        <p><strong>Price Range:</strong> ${priceRange}</p>
      </div>

      ${dealRequestData.additionalRequirements ? `
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Additional Requirements</h3>
          <p>${dealRequestData.additionalRequirements}</p>
        </div>
      ` : ''}

      <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #166534;">
          Please process this request and search for matching suppliers.
        </p>
      </div>
    </div>
  `;

  return await sendEmail({
    to: adminEmail,
    from: fromEmail,
    subject: `New Deal Request: ${dealRequestData.productName}`,
    text: emailContent,
    html: htmlContent,
  });
}