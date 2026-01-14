import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const getFromEmail = () => {
  return process.env.EMAIL_FROM || "Link6ync <noreply@link6ync.app>";
};

const getLogoUrl = () => {
  // Use hosted logo URL or fallback
  return process.env.LOGO_URL || "https://res.cloudinary.com/omakidx/image/upload/v1767109897/Rectangle_fxqxz4.png";
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: getFromEmail(),
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export const sendVerificationEmail = async (to: string, verifyUrl: string, name?: string) => {
  const subject = "Verify Your Email Address - Link6ync";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 48px 20px;">
              <table role="presentation" style="width: 520px; max-width: 100%; background-color: #ffffff;">
                <!-- Logo -->
                <tr>
                  <td style="padding: 0 0 32px; text-align: left;">
                    <img src="${getLogoUrl()}" alt="Link6ync" width="40" height="50" style="display: block;" />
                  </td>
                </tr>
                
                <!-- Title -->
                <tr>
                  <td style="padding: 0 0 24px;">
                    <h1 style="margin: 0; color: #1a1a2e; font-size: 24px; font-weight: 600;">
                      <span style="background-color: #FACC15; padding: 2px 6px; border-radius: 4px;">Verify</span> your email
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
                      ${name ? `Hi ${name},` : "Hi,"}
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      Someone tried to sign up for an account using email
                      <a href="mailto:${to}" style="color: #003DB8; text-decoration: none;">${to}</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      If it was you, click the button below to <span style="background-color: #FACC15; padding: 1px 4px; border-radius: 2px;">verify</span> your email:
                    </p>
                  </td>
                </tr>
                
                <!-- Button -->
                <tr>
                  <td style="padding: 24px 0;">
                    <a href="${verifyUrl}" style="display: inline-block; padding: 14px 32px; background-color: #003DB8; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 16px 0 0;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      If it wasn't you, please ignore this email.
                    </p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 32px 0 24px;">
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;" />
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #1a1a2e; font-size: 14px; font-weight: 600;">Link6ync</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Link6ync. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail(to, subject, html);
};

export const sendWelcomeEmail = async (to: string, name?: string) => {
  const subject = "Welcome to Link6ync!";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome!</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 48px 20px;">
              <table role="presentation" style="width: 520px; max-width: 100%; background-color: #ffffff;">
                <!-- Logo -->
                <tr>
                  <td style="padding: 0 0 32px; text-align: left;">
                    <img src="${getLogoUrl()}" alt="Link6ync" width="40" height="50" style="display: block;" />
                  </td>
                </tr>
                
                <!-- Title -->
                <tr>
                  <td style="padding: 0 0 24px;">
                    <h1 style="margin: 0; color: #1a1a2e; font-size: 24px; font-weight: 600;">
                      <span style="background-color: #FACC15; padding: 2px 6px; border-radius: 4px;">Welcome</span> to Link6ync!
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
                      ${name ? `Hi ${name},` : "Hi,"}
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      Your email has been verified! We're thrilled to have you on board.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 24px;">
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      Get ready to connect and grow with Link6ync. Here's what you can do next:
                    </p>
                  </td>
                </tr>
                
                <!-- Getting Started -->
                <tr>
                  <td style="padding: 0 0 24px;">
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 2;">
                      <li>Complete your profile in the dashboard</li>
                      <li>Enable two-factor authentication for extra security</li>
                      <li>Explore the features available to you</li>
                    </ul>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      If you have any questions, our support team is here to help!
                    </p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 32px 0 24px;">
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;" />
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #1a1a2e; font-size: 14px; font-weight: 600;">Link6ync</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Link6ync. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail(to, subject, html);
};

export const sendPasswordResetEmail = async (to: string, resetUrl: string, name?: string) => {
  const subject = "Reset Your Password - Link6ync";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
        <table role="presentation" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td align="center" style="padding: 48px 20px;">
              <table role="presentation" style="width: 520px; max-width: 100%; background-color: #ffffff;">
                <!-- Logo -->
                <tr>
                  <td style="padding: 0 0 32px; text-align: left;">
                    <img src="${getLogoUrl()}" alt="Link6ync" width="40" height="50" style="display: block;" />
                  </td>
                </tr>
                
                <!-- Title -->
                <tr>
                  <td style="padding: 0 0 24px;">
                    <h1 style="margin: 0; color: #1a1a2e; font-size: 24px; font-weight: 600;">
                      <span style="background-color: #FACC15; padding: 2px 6px; border-radius: 4px;">Reset</span> your password
                    </h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #1a1a2e; font-size: 15px; line-height: 1.6;">
                      ${name ? `Hi ${name},` : "Hi,"}
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      Someone requested a password reset for the account associated with
                      <a href="mailto:${to}" style="color: #003DB8; text-decoration: none;">${to}</a>.
                    </p>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 0 0 16px;">
                    <p style="margin: 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
                      If it was you, click the button below to <span style="background-color: #FACC15; padding: 1px 4px; border-radius: 2px;">reset</span> your password:
                    </p>
                  </td>
                </tr>
                
                <!-- Button -->
                <tr>
                  <td style="padding: 24px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #003DB8; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 16px 0 0;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                      If it wasn't you, please ignore this email. This link expires in 15 minutes.
                    </p>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td style="padding: 32px 0 24px;">
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 0;" />
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td>
                    <p style="margin: 0 0 4px; color: #1a1a2e; font-size: 14px; font-weight: 600;">Link6ync</p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                      © ${new Date().getFullYear()} Link6ync. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  return sendEmail(to, subject, html);
};
