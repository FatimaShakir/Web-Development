import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendNewLeadEmail(lead, adminEmail) {
  const mailOptions = {
    from: `"PropCRM" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `New Lead Created: ${lead.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="background: #1d4ed8; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">PropCRM</h1>
          <p style="color: #93c5fd; margin: 5px 0 0;">New Lead Alert</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b; margin-top: 0;">New Lead Received</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b; width: 40%;">Name</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: bold;">${lead.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Email</td>
              <td style="padding: 10px 0; color: #1e293b;">${lead.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Phone</td>
              <td style="padding: 10px 0; color: #1e293b;">${lead.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Budget</td>
              <td style="padding: 10px 0; color: #1e293b;">PKR ${lead.budget?.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Property Interest</td>
              <td style="padding: 10px 0; color: #1e293b;">${lead.propertyInterest}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Priority</td>
              <td style="padding: 10px 0;">
                <span style="background: ${lead.score === "High" ? "#fee2e2" : lead.score === "Medium" ? "#fef9c3" : "#dcfce7"}; 
                color: ${lead.score === "High" ? "#dc2626" : lead.score === "Medium" ? "#ca8a04" : "#16a34a"};
                padding: 3px 10px; border-radius: 20px; font-size: 13px; font-weight: bold;">
                  ${lead.score} Priority
                </span>
              </td>
            </tr>
          </table>
          <div style="margin-top: 25px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/admin/leads" 
               style="background: #1d4ed8; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              View Lead in CRM
            </a>
          </div>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 15px;">
          PropCRM — Property Dealer Management System
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendLeadAssignedEmail(lead, agentEmail, agentName) {
  const mailOptions = {
    from: `"PropCRM" <${process.env.EMAIL_USER}>`,
    to: agentEmail,
    subject: `Lead Assigned to You: ${lead.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
        <div style="background: #1d4ed8; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">PropCRM</h1>
          <p style="color: #93c5fd; margin: 5px 0 0;">Lead Assignment</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b; margin-top: 0;">Hi ${agentName},</h2>
          <p style="color: #475569;">A new lead has been assigned to you. Please follow up as soon as possible.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b; width: 40%;">Client Name</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: bold;">${lead.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Phone</td>
              <td style="padding: 10px 0; color: #1e293b;">${lead.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Budget</td>
              <td style="padding: 10px 0; color: #1e293b;">PKR ${lead.budget?.toLocaleString()}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 10px 0; color: #64748b;">Property Interest</td>
              <td style="padding: 10px 0; color: #1e293b;">${lead.propertyInterest}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b;">Priority</td>
              <td style="padding: 10px 0;">
                <span style="background: ${lead.score === "High" ? "#fee2e2" : lead.score === "Medium" ? "#fef9c3" : "#dcfce7"};
                color: ${lead.score === "High" ? "#dc2626" : lead.score === "Medium" ? "#ca8a04" : "#16a34a"};
                padding: 3px 10px; border-radius: 20px; font-size: 13px; font-weight: bold;">
                  ${lead.score} Priority
                </span>
              </td>
            </tr>
          </table>
          <div style="margin-top: 25px; text-align: center;">
            <a href="${process.env.NEXTAUTH_URL}/agent/leads" 
               style="background: #1d4ed8; color: white; padding: 12px 25px; border-radius: 6px; text-decoration: none; font-weight: bold;">
              View My Leads
            </a>
          </div>
        </div>
        <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 15px;">
          PropCRM — Property Dealer Management System
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}