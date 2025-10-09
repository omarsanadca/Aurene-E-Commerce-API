import jwt from "jsonwebtoken";

import UnAuthenticatedError from "../Errors/UnAuthenticatedError.js";

const isAuthenticated = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    throw new UnAuthenticatedError("Provide the token");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      if (
        err.message === "invalid signature" ||
        err.message === "secret or public key must be provided"
      ) {
        return next(err);
      }
      return next(new UnAuthenticatedError(err.message));
    }

    req.userId = payload.userId;

    next();
  });
};

export default isAuthenticated;
