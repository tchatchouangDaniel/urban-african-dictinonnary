/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { port } from './config';

// Routes imports
import categoryRoute from './handlers/category';
import categoryLetterRoute from './handlers/categoryLetter';
import tagRoute from './handlers/tag';
import userRoute from './handlers/users';
import definitionRoute from './handlers/definition';

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message:
    'Too many accounts created from this IP, please try again after a minute',
});

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(limiter);

// Endpoints
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to uraban african dictionnary',
  });
});
categoryRoute(app);
categoryLetterRoute(app);
tagRoute(app);
userRoute(app);
definitionRoute(app);

// Listen
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server listening on http://localhost:${port}`);
});

export default app;
