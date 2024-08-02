import { useState } from "react";
import {
  Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import SignupPage from "./components/SignupPage";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./components/AdminPanel";
import VerificationPage from "./components/VerificationPage";
import "./index.css";
import EmployeePanel from "./components/EmployeePanel";
import ManagerPanel from "./components/ManagerPanel";

function App() {
  return (
    <div className="m-0 p-0">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage></LoginPage>}></Route>
          <Route path="/signup" element={<SignupPage></SignupPage>}></Route>
          <Route
            path="/admin-panel"
            element={<ProtectedRoute element={AdminPanel} />}
          />

          <Route
            path="/employee-panel"
            element={<ProtectedRoute element={EmployeePanel} />}
          />
          <Route
            path="/manager-panel"
            element={<ProtectedRoute element={ManagerPanel} />}
          />
          <Route path="/verify-email" element={<VerificationPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
