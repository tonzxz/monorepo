import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../../lib/api/auth";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login: setAuthToken } = useAuth();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuthToken(data.accessToken);
      navigate("/app", { replace: true });
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate({ email, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Sign in to continue to your dashboard.</p>
        </div>
        <form className="auth-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <button className="button" type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        {mutation.isError ? (
          <p className="error-text">Login failed. Check your credentials.</p>
        ) : null}
        <div className="auth-footer">
          <span>Need access?</span>
          <Link to="/" className="text-link">Contact admin</Link>
        </div>
      </div>
    </div>
  );
}
