import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorMiddleware.js";

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fullstack-template-a7kq.onrender.com/",
    ],
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoute);
app.get("/", (req, res) => {
  res.send("Home Page...");
});

connectDB();
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Server is running at: ${PORT}`);
});
