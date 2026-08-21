import express from "express";
import cors from "cors";
import routes from "./routes/index.js"
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

//Rotas

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());


app.use("/api", routes);

app.use(notFound);

app.use(errorHandler);

export default app;

//oi