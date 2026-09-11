export const getToken = (request) => {
    const authHeader = request?.headers?.authorization;

    if (!authHeader) return null;

    const [scheme, token, ...extra] = authHeader.trim().split(/\s+/);
    if (scheme?.toLowerCase() !== "bearer" || !token || extra.length > 0) {
        return null;
    }

    return token;
}