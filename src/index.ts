import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import appRoutes from './routes';
import db from './lib/db';
import path from 'path';
import { errorHandler } from './middleware/error';

dotenv.config();

//database
db();

// Boot express
const app: Application = express();

//express middlewares
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:4200'],
    credentials: true,
  })
);
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//routes
app.use('/api', appRoutes);

//default view templet
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

//costom middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
