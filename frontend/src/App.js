// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
// import ListarApostas from './pages/ListarApostas';
// import Historico from './pages/Historico';
// import Sidebar from 'react-sidebar';
// import Log from './pages/Log'
// import './App.css';
// import { UserProvider } from './UserContext'; // Caminho para o arquivo


// function AppRoutes() {
//   const [sidebarOpen, setSidebarOpen] = useState(false); //controle da sidebar

//   const openSidebar = () => setSidebarOpen(true); //arir a sidebar
//   const closeSidebar = () => setSidebarOpen(false); //fechar a sidebar

//   return (
//     <Router>
//       <div className="app-container">
//         {/* Configuração da Sidebar */}
//         <Sidebar
//           sidebar={
//             <div className="sidebar-content">
//               <div className="sidebar-header">
//                 <h3>Navegação</h3>
//                 <button className="close-btn" onClick={closeSidebar}>
//                   <FontAwesomeIcon icon={faTimes} />
//                 </button>
//               </div>
//               <ul>
//                 <li>
//                   <Link to="/" onClick={closeSidebar}>Página Inicial</Link>
//                 </li>
//                 <li>
//                   <Link to="/listar-apostas" onClick={closeSidebar}>Listar Apostas</Link>
//                 </li>
//                 <li>
//                   <Link to="/listar-apostas-simples" onClick={closeSidebar}>Histórico de resultados</Link>
//                 </li>
//                 <li>
//                   <Link to="/listar-log" onClick={closeSidebar}>LOG</Link>
//                 </li>
//               </ul>
//             </div>
//           }
//           open={sidebarOpen}
//           onSetOpen={setSidebarOpen}
//           styles={{ sidebar: { background: "#2c3e50", color: "white", width: "250px", padding: "10px" } }}
//         >
//           {/* sidebarbutton */}
//           <button className="menu-btn" onClick={openSidebar}>
//             <FontAwesomeIcon icon={faBars} />
//           </button>
//           <div className="main-content">
//             <Routes>
//               <Route 
//                 path="/" 
//                 element={
//                   <div className="homepage-container">
//                     <h1 className="homepage-title">DBET 💰</h1>
//                     <p className="homepage-subtitle">
//                       A plataforma onde apostas se tornam lucros!  <br /> 
                    
//                     </p>
//                   </div>
//                 } 
//               />
//               <Route path="/listar-apostas" element={<ListarApostas />} />
//               <Route path="/listar-apostas-simples" element={<Historico />} />
//               <Route path="/listar-log" element={<Log/>} />
//             </Routes>
//           </div>
//         </Sidebar>
//       </div>
//     </Router>
//   );
// }

// export default AppRoutes;




import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import ListarApostas from './pages/ListarApostas';
import Historico from './pages/Historico';
import Sidebar from 'react-sidebar';
import Log from './pages/Log';
import './App.css';
import { UserProvider } from './UserContext'; // Import do contexto global

function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Controle da sidebar

  const openSidebar = () => setSidebarOpen(true); // Abrir a sidebar
  const closeSidebar = () => setSidebarOpen(false); // Fechar a sidebar

  return (
    // Envolva toda a aplicação com UserProvider
    <UserProvider>
      <Router>
        <div className="app-container">
          {/* Configuração da Sidebar */}
          <Sidebar
            sidebar={
              <div className="sidebar-content">
                <div className="sidebar-header">
                  <h3>Navegação</h3>
                  <button className="close-btn" onClick={closeSidebar}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                <ul>
                  <li>
                    <Link to="/" onClick={closeSidebar}>Página Inicial</Link>
                  </li>
                  <li>
                    <Link to="/listar-apostas" onClick={closeSidebar}>Listar Apostas</Link>
                  </li>
                  <li>
                    <Link to="/listar-apostas-simples" onClick={closeSidebar}>Histórico de resultados</Link>
                  </li>
                  <li>
                    <Link to="/listar-log" onClick={closeSidebar}>LOG</Link>
                  </li>
                </ul>
              </div>
            }
            open={sidebarOpen}
            onSetOpen={setSidebarOpen}
            styles={{ sidebar: { background: "#2c3e50", color: "white", width: "250px", padding: "10px" } }}
          >
            {/* Botão para abrir a sidebar */}
            <button className="menu-btn" onClick={openSidebar}>
              <FontAwesomeIcon icon={faBars} />
            </button>
            <div className="main-content">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <div className="homepage-container">
                      <h1 className="homepage-title">DBET 💰</h1>
                      <p className="homepage-subtitle">
                        A plataforma onde apostas se tornam lucros!  <br /> 
                      </p>
                    </div>
                  } 
                />
                <Route path="/listar-apostas" element={<ListarApostas />} />
                <Route path="/listar-apostas-simples" element={<Historico />} />
                <Route path="/listar-log" element={<Log />} />
              </Routes>
            </div>
          </Sidebar>
        </div>
      </Router>
    </UserProvider>
  );
}

export default AppRoutes;
