export class ValidationError extends Error {
    constructor() {
        super(`The request structure is invalid. The server can't even parse the data.`);
    }
}
