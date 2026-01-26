import PageHeader from "../../../components/common/PageHeader";

export default function DashboardPage() {
  return (
    <section className="page">
      <PageHeader
        title="Dashboard"
        description="Overview of users, departments, and approvals."
      />
      <div className="grid">
        <div className="card">
          <h3>Total Users</h3>
          <p className="metric">24</p>
        </div>
        <div className="card">
          <h3>Departments</h3>
          <p className="metric">6</p>
        </div>
        <div className="card">
          <h3>Pending Approvals</h3>
          <p className="metric">3</p>
        </div>
      </div>
    </section>
  );
}
