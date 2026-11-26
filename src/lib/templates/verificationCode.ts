export interface VerificationCodeData {
    code: string;
    email: string;
}

export function generateVerificationCodeHTML(data: VerificationCodeData): string {
    return `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Sarge verification code</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e7; border-radius: 12px; overflow: hidden;">
            <div style="background-color: #4D38EF; padding: 24px;">
                <h1 style="margin: 0; font-size: 18px; font-weight: 700; color: white;">Confirm your email</h1>
            </div>
            <div style="padding: 32px 24px; color: #000000;">
                <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #333333;">
                    Enter this code on Sarge to verify <strong>${data.email}</strong>:
                </p>
                <p style="margin: 0 0 24px 0; text-align: center; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #4D38EF;">
                    ${data.code}
                </p>
                <div style="border-top: 1px solid #e5e5e7; padding-top: 16px;">
                    <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #666666;">
                        This code expires in 5 minutes. If you didn't sign up for Sarge, you can safely ignore this email.
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
    `.trim();
}
