import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import DashboardPage from "./views/DashboardPage";
import UsersPage from "./views/UsersPage";
import TeamsPage from "./views/TeamsPage";
import AuditPage from "./views/AuditPage";
import TeamRequestsPage from "./views/TeamRequestsPage";
import TeamDetailsPage from "./views/TeamDetailsPage";
import UserRequestsPage from "./views/UserRequestsPage"
import UserEditPage from "./views/UserEditPage"
import UserRegisterPage from "./views/UserRegisterPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/teams/requests" element={<TeamRequestsPage />} />
        <Route path="/teams/details" element={<TeamDetailsPage />} />
        <Route path="/user/requests" element={<UserRequestsPage />} />
        <Route path="/users/edit" element={<UserEditPage />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
