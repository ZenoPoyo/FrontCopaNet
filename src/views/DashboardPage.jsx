import Sidebar from "../components/Sidebar";
import "../Dashboard.css";

export default function DashboardPage() {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">

        <h1 className="dashboard-title">Panel de administración</h1>


        <div className="dashboard-columns">

          <div className="dashboard-left">
            <div className="stats-grid">
              <div className="stat-card">
                <p>Sanciones recientes</p>
                <h2>4</h2>
              </div>

              <div className="stat-card">
                <p>Equipos activos</p>
                <h2>23</h2>
              </div>

              <div className="stat-card">
                <p>Total multas</p>
                <h2>₡10,540.55</h2>
              </div>

              <div className="stat-card">
                <p>Usuarios registrados</p>
                <h2>31</h2>
              </div>
            </div>


            <div className="tournaments-section">
              <h2 className="section-title">Torneos en curso</h2>

              <div className="tournaments-card">
                <table className="tournaments-table">
                  <thead>
                    <tr>
                      <th>Torneo</th>
                      <th>Próximo encuentro</th>
                      <th>Equipos activos</th>
                      <th>Fecha final</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Verano 2027</td>
                      <td>15/11/2025</td>
                      <td>7</td>
                      <td>12/12/2025</td>
                    </tr>
                    <tr>
                      <td>Invierno 2026</td>
                      <td>15/11/2025</td>
                      <td>3</td>
                      <td>25/11/2025</td>
                    </tr>
                    <tr>
                      <td>Invierno 2027</td>
                      <td>15/11/2025</td>
                      <td>2</td>
                      <td>24/12/2025</td>
                    </tr>
                    <tr>
                      <td>Otoño 2026</td>
                      <td>20/11/2025</td>
                      <td>4</td>
                      <td>18/12/2025</td>
                    </tr>
                    <tr>
                      <td>Primavera 2027</td>
                      <td>30/11/2025</td>
                      <td>6</td>
                      <td>28/12/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          <div className="notifications-section">
            <div className="notifications-card">
              <h2 className="notifications-title">Notificaciones</h2>

              <table className="notifications-table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="dot"></span> Comprobante inscrito
                    </td>
                    <td>#6055980</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="dot"></span> Registro pendiente
                    </td>
                    <td>#6055980</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="dot"></span> Solicitud modificada
                    </td>
                    <td>#6055980</td>
                  </tr>
                  <tr>
                    <td>
                      <span className="dot"></span> Comprobante inscrito
                    </td>
                    <td>#6055980</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


