export interface EmailVerificationData {
    verifyUrl: string;
    email: string;
}

export function generateEmailVerificationHTML(data: EmailVerificationData): string {
    return `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e7; border-radius: 12px; overflow: hidden;">

            <div style="background-color: #4D38EF; padding: 24px;">
                <h1 style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3; color: white; letter-spacing: 0.5px;">
                    Verify your email
                </h1>
            </div>

            <div style="padding: 32px 24px; color: #000000;">
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">Hello,</p>

                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #333333;">
                    Click the button below to verify <strong>${data.email}</strong> on Sarge.
                </p>

                <div style="text-align: center; margin: 0 0 24px 0;">
                    <a
                        href="${data.verifyUrl}"
                        style="display: inline-block; background-color: #4D38EF; color: white; font-weight: 500; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-size: 15px;"
                    >
                        Verify email
                    </a>
                </div>

                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.6; color: #666666;">
                    Or copy and paste this link into your browser:
                </p>
                <p style="margin: 0 0 24px 0; font-size: 12px; line-height: 1.6; color: #4D38EF; word-break: break-all;">
                    ${data.verifyUrl}
                </p>

                <div style="border-top: 1px solid #e5e5e7; padding-top: 16px; margin-top: 8px;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #666666;">
                        If you didn't sign up or request this, you can safely ignore this email. This link expires in 1 hour.
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
    `.trim();
}
