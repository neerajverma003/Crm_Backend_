// server.js or index.js

import dotenv from "dotenv";
dotenv.config(); // ✅ Load env variables

import express from "express";
const app = express();

import connectDB from "./config/connection.js"; // ✅ Add .js extension
import adminRoutes from "./src/routes/adminRoutes.js"; // ✅ Add .js extension
import companyRoutes from "./src/routes/companyRoutes.js"; // ✅ Add .js extension
import employeeRoutes from "./src/routes/employeeRoutes.js"; // ✅ Add .js extension
import attendanceRoute from "./src/routes/attendanceRoute.js"; // ✅ Add .js extension
import SuperAdminRoutes from "./src/routes/SuperAdminRoutes.js"; // ✅ Add .js extension
import loginRoutes from "./src/routes/loginRoutes.js"
import leadRoutes from "./src/routes/leadRoutes.js"
import chequeRoutes from "./src/routes/chequeRoutes.js"
import expenseRoutes from "./src/routes/expenseRoutes.js"
import employeeLeadRoutes from "./src/routes/employeeLeadRoutes.js"
import departmentRoutes from "./src/routes/departmentRoutes.js"
import designationRoutes from "./src/routes/designationRoutes.js";
import roleRoutes from "./src/routes/roleRoutes.js"
import stateRoutes from "./src/routes/stateRoutes.js"
import destinationRoutes from "./src/routes/destinationRoutes.js"
import hotelRoutes from "./src/routes/hotelRoutes.js"
import transportRoutes from "./src/routes/transportRoutes.js"
import cors from "cors";
import "./src/utils/scheduleJob.js"
import { corsOptions } from "./config/corsOptions.js"; // ✅ Add .js extension
import  AdminAttendance  from "./src/routes/adminAttendance.js"
connectDB(); // ✅ Connect to MongoDB

app.use(express.json()); // ✅ Enable JSON body parsing
app.use(cors(corsOptions));

app.use("/", adminRoutes);
app.use("/company", companyRoutes);
app.use("/leads", leadRoutes);
app.use("/employee", employeeRoutes);
app.use("/attendance", attendanceRoute);
app.use('/AddSuperAdmin', SuperAdminRoutes);
app.use("/cheque", chequeRoutes)
app.use('/login' , loginRoutes)
app.use('/expense',expenseRoutes)
app.use('/adminAttendance' , AdminAttendance)
app.use("/employeelead",employeeLeadRoutes)
app.use('/department',departmentRoutes)
app.use('/designation',designationRoutes)
app.use("/role", roleRoutes)
app.use("/state",stateRoutes)
app.use("/destination",destinationRoutes)
app.use("/hotel",hotelRoutes)
app.use("/transport",transportRoutes)
app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
