import { validationResult } from "express-validator";

import ValidationError from "../Errors/ValidationError.js";

const handleValidationResults = (errMessage) => {
  return (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      throw new ValidationError(errMessage, result.array());
    }
    next();
  };
};

export default handleValidationResults;
