/**
 * Assessment invitation emails only go out when EMAIL_SENDING_ENABLED=true, so a local
 * environment can't mail real candidates unless it opts in.
 */
export function isEmailSendingEnabled(): boolean {
    return process.env.EMAIL_SENDING_ENABLED === 'true';
}
