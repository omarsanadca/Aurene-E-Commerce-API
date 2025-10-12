import bcrypt from "bcryptjs";

import { userModel } from "../models/user.model.js";

const createAdminUser = async () => {
  // const adminUser = await userModel.findOne().where("role").equals("admin");
  const adminUser = await userModel.findOne({ role: "admin" });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "1234",
      10
    );

    await userModel.create({
      firstName: "Super Admin",
      lastName: "(Server Generated)",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      userName: "super_admin",
      region: "Cairo",
      role: "admin",
    });
  }
};

export default createAdminUser;
