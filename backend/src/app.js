import express from "express";

import authRouter from "./routes/auth.route.js";
import employeeRouter from "./routes/employee.route.js";
import departmentRouter from "./routes/department.route.js";
import profileRouter from "./routes/profile.route.js";
import path from "path";

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/employee", employeeRouter);
app.use("/department", departmentRouter);
app.use("/emp-profile", profileRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;
