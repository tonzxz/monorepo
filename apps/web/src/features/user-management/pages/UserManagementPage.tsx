import PageHeader from "../../../components/common/PageHeader";

export default function UserManagementPage() {
  return (
    <section className="page">
      <PageHeader
        title="User Management"
        description="Create users, assign roles, and control access."
      />
      <div className="card">
        <p>Users table will live here.</p>
      </div>
    </section>
  );
}
