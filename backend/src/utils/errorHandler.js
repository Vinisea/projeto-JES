export const errorHandler = (err, req, res, next) => {
    const response = (res && typeof res.status === "function")
        ? res
        : (req && typeof req.status === "function")
            ? req
            : null;

    if (!response) {
        return;
    }

    console.error(err);

    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        return response.status(400).json({
            message: err.errors.map(error => error.message)
        });
    }

    return response.status(err.status || 500).json({
        message: err.message || "Erro interno do servidor"
    });
};