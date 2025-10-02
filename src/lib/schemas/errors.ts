export class InvalidInputError extends Error {
    constructor() {
        super(`The request structure is invalid. The server can't even parse the data.`);
    }
}

export class InternalServerError extends Error {
    constructor() {
        super('Internal server error occurred.');
    }
}
