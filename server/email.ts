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