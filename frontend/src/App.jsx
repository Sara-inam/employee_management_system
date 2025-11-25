import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/adminDashboard.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ResetPassword from './pages/ResetPassword.jsx';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageEmployee from './pages/ManageEmployee.jsx';
import ManageSalary from './pages/ManageSalary.jsx';
import AdminLayout from './components/AdminLayout.jsx';
<<<<<<< HEAD
import ManageDepartment from './pages/ManageDepartment.jsx';
=======
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994



function App() {
  return (
    <>
    
      <BrowserRouter>
         <Routes>
       
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

     
        <Route element={<AdminLayout />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/manage-employee" element={<ManageEmployee />} />
          <Route path="/manage-salary" element={<ManageSalary />} />
<<<<<<< HEAD
          <Route path="/manage-department" element={<ManageDepartment />} />
=======
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
        </Route>
      </Routes>
      </BrowserRouter>


{/* use ToastContainer */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}  // 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;
