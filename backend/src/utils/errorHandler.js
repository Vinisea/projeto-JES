export const errorHandler = (err, res) => {
    const status = err.status ||
        (err.name === "SequelizeValidationError" ? 400 : undefined) ||
        (err.name === "SequelizeUniqueConstraintError" ? 409 : undefined) ||
        (err.name === "SequelizeForeignKeyConstraintError" ? 409 : undefined) ||
        500;
    const message = err.name === "SequelizeValidationError"
        ? err.errors.map(({ message }) => message)
        : err.message || "Erro interno do servidor";

    if (status >= 500) console.error(err);
    return res.status(status).json({ message });
};

//oi