import express from 'express';
import historyRoutes from '@/routes/history.routes';
import standardRoutes from '@/routes/standard.routes';

const app = express();
const PORT = 4000;

app.use(express.json());

app.use('/history', historyRoutes);
app.use('/standard', standardRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
