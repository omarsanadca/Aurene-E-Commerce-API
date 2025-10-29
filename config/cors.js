import cors from "cors";

const corsConfig = cors({
  origin: "*",
  allowedMethod: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["authorization", "content-type"],
  credentials: true,
});

export default corsConfig;