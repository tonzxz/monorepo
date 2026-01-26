import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  return (
    <section className="page">
      <h1>Access denied</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/" className="button">Back to dashboard</Link>
    </section>
  );
}
