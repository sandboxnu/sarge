const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
    return emailRegex.test(email);
}

export function getInvalidEmails(emails: string[]): string[] {
    return emails.filter((email) => !isValidEmail(email));
}

const MAX_DISPLAY_CHARS = 25;

export function truncateEmail(email: string): string {
    if (email.length <= MAX_DISPLAY_CHARS) return email;
    return `${email.slice(0, MAX_DISPLAY_CHARS)}…`;
}
