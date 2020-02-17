import express from "express";
import cors from 'cors';
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import eventRouter from "./routers/eventRouter";
import path from "path";

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// routes static file
app.use(express.static(path.join(__dirname, 'public')));
// routes REST API
app.use('/api', eventRouter);

export default app;
