export const requireAdmin = (req, res, next) => {
  if (req.usuario?.tipo_usuario !== "Administrador") {
    const path = String(req.originalUrl || req.path || "");
    const message = path.includes("/usuarios")
      ? "Permissão insuficiente para esta operação."
      : "Acesso permitido apenas para administradores.";

    return res.status(403).json({ msg: message });
  }

  return next();
};