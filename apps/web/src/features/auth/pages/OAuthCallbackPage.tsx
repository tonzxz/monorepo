import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Only process once to avoid multiple redirects
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
    const needsOnboarding = params.get("onboarding");

    console.log("OAuth Callback - URL:", window.location.href);
    console.log("OAuth Callback - Token:", token);
    console.log("OAuth Callback - Error:", error);
    console.log("OAuth Callback - Needs Onboarding:", needsOnboarding);

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=oauth_failed", { replace: true });
      return;
    }

    if (token) {
      login(token);
      // Redirect to onboarding if needed, otherwise go to dashboard
      if (needsOnboarding === "true") {
        console.log("Redirecting to onboarding");
        navigate("/onboarding", { replace: true });
      } else {
        console.log("Redirecting to dashboard");
        navigate("/app", { replace: true });
      }
    } else {
      console.log("No token found, redirecting to login");
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing sign in...</h2>
        <p className="text-muted-foreground mt-2">Please wait while we redirect you.</p>
      </div>
    </div>
  );
}
