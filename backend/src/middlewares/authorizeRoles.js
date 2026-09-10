export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.usuario?.tipo_usuario) {
    return res.status(403).json({ msg: "Permissão insuficiente." });
  }

  if (!allowedRoles.includes(req.usuario.tipo_usuario)) {
    return res.status(403).json({ msg: "Permissão insuficiente para esta operação." });
  }

  return next();
};
