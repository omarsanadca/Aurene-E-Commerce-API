import cors from "cors";

const corsConfig = cors({
  origin: "localhost:3000",
  allowedMethod: ["GET", "POST", "DELETE", "PATCH"],
  allowedHeaders: ["authorization", "content-type"],
  credentials: true,
});

export default corsConfig;