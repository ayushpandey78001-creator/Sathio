import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Discover from "./pages/Discover";
import Connections from "./pages/Connections";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="border-t border-line py-8 text-center font-mono text-xs text-ink/40">
        sathio — find your people, build together.
      </footer>
    </div>
  );
}
