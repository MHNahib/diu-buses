const checkAdmin = (req, res, next) => {
  const { isAdmin, role } = req.user;

  if (!isAdmin) return res.status(403).send(`Request has been forbidden`);

  if (role[0] !== "Employee")
    return res.status(403).send(`Request has been forbidden`);
  if (role[1] !== "Admin")
    return res.status(403).send(`Request has been forbidden`);

  next();
};

module.exports = checkAdmin;
