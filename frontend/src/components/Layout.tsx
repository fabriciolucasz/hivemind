import { Outlet, useNavigate, useLocation } from "react-router-dom";
import '../App.css';
import Logo from "./Logo";
import DashboardIcon from "./DashboardIcon";
import DiarioIcon from "./DiarioIcon";
import EvolucaoIcon from "./EvolucaoIcon";
import EventosIcon from "./EventosIcon";
import MentorIaIcon from "./MentorIaIcon";
import TesteVocacionalIcon from "./TesteVocacionalIcon";
import PerfilIcon from "./PerfilIcon";
import LogoutIcon from "./LogoutIcon";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const { signOut } = useAuth();
  const path = location.pathname; 

  const handleSignOut = () => {
    signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="layout-container">
      
      <aside className="sidebar">
        <div className="sidebar-logo-container">
          <div className="logo-icon">
            <Logo />
          </div>
          <div className="logo-text">
            <h2>Hive Mind</h2>
            <p>Apoio Vocacional</p>
          </div>
        </div>
        
        <nav className="sidebar-menu">
          <button 
            className={path === "/dashboard" ? "ativo" : ""}
            onClick={() => navigate("/dashboard")}
          >
            <DashboardIcon /> Dashboard
          </button>
          
          <button 
            className={path === "/diario" ? "ativo" : ""}
            onClick={() => navigate("/diario")}
          >
            <DiarioIcon /> Diário
          </button>
          
          <button 
            className={path === "/evolucao" ? "ativo" : ""}
            onClick={() => navigate("/evolucao")}
          >
            <EvolucaoIcon /> Evolução de Desempenho
          </button>
          <button 
            className={path === "/eventos" ? "ativo" : ""}
            onClick={() => navigate("/eventos")}
          >
            <EventosIcon /> Eventos
          </button>
          <button
            className={path === "/mentor" ? "ativo" : ""}
            onClick={() => navigate("/mentor")}
          >
            <MentorIaIcon /> Mentor IA
          </button>
          <button 
            className={path === "/teste" ? "ativo" : ""}
            onClick={() => navigate("/teste")}
          >
            <TesteVocacionalIcon /> Teste Vocacional
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button
            className={path === "/perfil" || path === "/profile" ? "ativo" : ""}
            onClick={() => navigate("/perfil")}
          >
            <PerfilIcon /> Perfil
          </button>
          <button onClick={handleSignOut}>
            <LogoutIcon /> Sair
          </button>
        </div>
      </aside>

      <main className="main-content">
        
        <Outlet />
      </main>
    </div>
  );
}
