import UnAuthorizedError from "../Errors/UnAuthorizedError.js";
import { userModel as User } from "../models/user.model.js";

const isAdmin = async (req, res, next) => {
  const { userId } = req;
  const user = await User.findById(userId);
  if (user.role !== "admin") {
    throw new UnAuthorizedError("You don't have access for this resource");
  }

  req.userRole = "admin";

  next();
};

export default isAdmin;
