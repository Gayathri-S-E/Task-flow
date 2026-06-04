import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import LoginView from "./custom-pages/auth/LoginView";
import RegisterView from "./custom-pages/auth/RegisterView";
import SummaryView from "./custom-pages/summary/SummaryView";
import TaskView from "./custom-pages/task/TaskView";
import TaskDetailView from "./custom-pages/task/TaskDetailView";
import UserView from "./custom-pages/user/UserView";

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: "glass-panel bg-dark-900 border-dark-800 text-white font-sans",
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #334155",
            borderRadius: "12px",
          }
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/" element={<ProtectedRoute><SummaryView /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TaskView /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetailView /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserView /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
