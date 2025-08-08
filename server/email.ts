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
      from: params.from,
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

export async function sendDealRequestToAdmin(dealRequestData: DealRequestEmailData): Promise<boolean> {
  const adminEmail = 'admin@businessdailydeals.com.za'; // You can make this configurable
  const fromEmail = 'noreply@businessdailydeals.com.za'; // You can make this configurable

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