import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard</h1>
        <p>Manage your travel plans and explore your saved trips.</p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>My Trips</h3>
            <p>View and manage your planned trips.</p>
          </div>

          <div className="dashboard-card">
            <h3>Saved Hotels</h3>
            <p>Check your saved hotel recommendations.</p>
          </div>

          <div className="dashboard-card">
            <h3>Travel Plans</h3>
            <p>Create and manage your personalized itineraries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;