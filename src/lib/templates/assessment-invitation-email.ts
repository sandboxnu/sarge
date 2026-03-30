export interface AssessmentInvitationEmailData {
    candidateName: string;
    positionTitle: string;
    organizationName: string;
    assessmentId: string;
    assessmentUrl: string;
    logoUrl: string;
}

export function generateAssessmentInvitationHTML(data: AssessmentInvitationEmailData): string {
    return `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Online Assessment Invitation</title>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e7; border-radius: 12px; overflow: hidden;">
            
            <!-- Header -->
            <div style="background-color: #4D38EF; padding: 24px; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px;">
                <div style="flex: 1;">
                    <h1 style="margin: 0; font-size: 18px; font-weight: 700; line-height: 1.3; color: white; letter-spacing: 0.5px;">
                        ${data.organizationName} ${data.positionTitle} Role: Online Assessment Invitation
                    </h1>
                </div>
                <!-- where the logo should be -->
            </div>

            <!-- Body -->
            <div style="padding: 32px 24px; color: #000000;">
                <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">Hello ${data.candidateName},</p>
                
                <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #333333;">
                    Thank you for your application and interest in ${data.organizationName}! The first step in our application process is a coding assessment to evaluate your technical and problem-solving skills.
                </p>

                <!-- Guidelines -->
                <div style="margin: 0 0 32px 0;">
                    <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #000000;">Online Assessment Guidelines:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #333333; font-size: 14px; line-height: 1.6;">
                        <li style="margin-bottom: 8px;">Your test will auto-submit your saved progress if you refresh or close the page.</li>
                        <li style="margin-bottom: 8px;">Changing tabs or windows during the exam will be reported to the exam administrator.</li>
                        <li>Questions are linear, meaning you will not be able to navigate between questions.</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 0 0 32px 0; padding: 24px 0;">
                    <div style="margin-bottom: 16px; font-size: 14px; color: #333333;">
                        <strong>Duration:</strong> 120 minutes
                    </div>
                    <div style="font-size: 14px; color: #333333;">
                        <strong>Test Expiration Date:</strong> March 16, 2026 11:59PM EST
                    </div>
                </div>

                <div style="text-align: center; margin: 0 0 24px 0;">
                    <a 
                        href="/assessment/${data.assessmentId}" 
                        style="display: inline-block; background-color: #5D5BF7; color: white; font-weight: 500; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-size: 15px;"
                    >
                        Open Assessment
                    </a>
                </div>

                <div style="text-align: center; font-size: 14px; color: #333333; margin: 0 0 16px 0;">
                    <p style="margin: 0;">
                        You can also use <a href="/assessment/${data.assessmentId}" style="color: #4D38EF; text-decoration: underline; font-weight: 600;">this link</a> to access your assessment. Visiting this link will not begin the assessment.
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>
    `.trim();
}
