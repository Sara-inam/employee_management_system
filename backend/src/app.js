import express from "express";
import salaryRouter from './routes/salary.route.js';
import authRouter from './routes/auth.route.js';
import employeeRouter from './routes/employee.route.js';

const app = express();

app.use(express.json());


app.use("/auth", authRouter);      
app.use("/employee", employeeRouter); 
app.use("/salary", salaryRouter);       


app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;
