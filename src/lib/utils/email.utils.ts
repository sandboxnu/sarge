const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
    return emailRegex.test(email);
}

export function getInvalidEmails(emails: string[]): string[] {
    return emails.filter((email) => !isValidEmail(email));
}
