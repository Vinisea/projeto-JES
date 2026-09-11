export const requireAdmin = (req, res, next) => {
  if (req.usuario?.tipo_usuario !== "Administrador") {
    return res.status(403).json({
      msg: "Acesso permitido apenas para administradores."
    });
  }

  next();
};