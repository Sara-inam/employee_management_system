import express from "express";
import salaryRouter from './routes/salary.route.js';
import authRouter from './routes/auth.route.js';
import employeeRouter from './routes/employee.route.js';
<<<<<<< HEAD
import departmentRouter from "./routes/department.route.js";
=======

>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
const app = express();

app.use(express.json());


app.use("/auth", authRouter);      
app.use("/employee", employeeRouter); 
<<<<<<< HEAD
app.use("/salary", salaryRouter);
app.use("/department", departmentRouter); 
      
=======
app.use("/salary", salaryRouter);       
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994


app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;
