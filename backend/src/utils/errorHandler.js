export const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.name === "SequelizeValidationError") {
        return res.status(400).json({
            message: err.errors.map(error => error.message)
        });
    }

    return res.status(err.status || 500).json({
        message: err.message || "Erro interno do servidor"
    });
};
