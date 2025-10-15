import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

// api routes
import apiRoutes from "./routes/index.js";

// configurations
import corsConfig from "./config/cors.js";

// middlewares
import errorMiddleware from "./middlewares/errorMiddleware.js";

// utils
import createAdminUser from "./utils/createAdminUser.js";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Server is OK!" });
});

app.use(express.json());
app.use(corsConfig);

if (process.env.NODE_ENV !== "production") {
  console.log("I am in development");
} else {
  console.log("I am in production🚀");
}

const PORT = process.env.PORT || 4000;

app.use("/api", apiRoutes);

app.use(errorMiddleware);

app.listen(PORT, (err) => {
  if (err) {
    console.log("Error while starting the server❗", err.message);
    return;
  }
  mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(async () => {
      console.log(`Server running on PORT ${PORT}🚀`);

      // check if there is an admin user, otherwise create one
      await createAdminUser();
    })
    .catch((err) => {
      console.log(`Failed to connect to mongodb❌`, err.message);
    });
});
