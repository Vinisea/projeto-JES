export const errorHandler = (err, res) => {
    console.error(err);

    return res.status(err.status || 500).json({
        message: err.message || "Erro interno do servidor"
    });
};

//oi