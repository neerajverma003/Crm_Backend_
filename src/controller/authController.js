// // controllers/authController.js
// import jwt from "jsonwebtoken";
// import bcrypt from 'bcrypt';
// import SuperAdmin from "../models/SuperAdminModel.js";
// import Admin from "../models/Adminmodel.js";
// import Employee from "../models/employeeModel.js";

// export const loginUser = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;
//     let Model;
//     if (role === "superAdmin") Model = SuperAdmin;
//     else if (role === "admin") Model = Admin;
//     else if (role === "employee") Model = Employee;
//     else return res.status(400).json({ message: "Invalid role" });

//     const user = await Model.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     console.log(isMatch);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//       const token = jwt.sign(
//       { id: user._id, role },
//       process.env.JWT,
//       console.log(process.env.JWT),  
//       { expiresIn: "1d" }
//     );

//     res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         email: user.email,
//         username: user.fullName,
//         role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import SuperAdmin from "../models/SuperAdminModel.js";
import Admin from "../models/Adminmodel.js";
import Employee from "../models/employeeModel.js";

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    let Model;

    if (role === "superAdmin") Model = SuperAdmin;
    else if (role === "admin") Model = Admin;
    else if (role === "employee") Model = Employee;
    else return res.status(400).json({ message: "Invalid role" });

    const user = await Model.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Prepare payload for JWT
    const payload = { id: user._id, role };

    // Add companyId only for employees
    if (role === "employee" || role ==="admin") {
      payload.companyId = user.company; // assuming company field exists in Employee model
    }

    const token = jwt.sign(payload, process.env.JWT, { expiresIn: "1d" });

    // Prepare user info response
    const userResponse = {
      id: user._id,
      email: user.email,
      username: user.fullName,
      role,
    };

    if (role === "employee" || role==="admin") {
      userResponse.companyId = user.company;
    }

    res.status(200).json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
