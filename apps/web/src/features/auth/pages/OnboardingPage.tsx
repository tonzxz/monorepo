import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api/auth";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import pcic from "@/assets/pcic.png";

export default function OnboardingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      navigate("/app", { replace: true });
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      setErrorMessage(error.message || "Failed to update profile. Please try again.");
    },
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    
    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (password && password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    
    if (password && !/\d/.test(password)) {
      setErrorMessage("Password must contain at least 1 digit");
      return;
    }
    
    mutation.mutate({ address, phoneNumber, password: password || undefined });
  };

  const handleSkip = () => {
    navigate("/app", { replace: true });
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <img src={pcic} alt="PCIC" className="size-24" />
        </a>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome! 👋</CardTitle>
            <CardDescription>
              Let's complete your profile to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="rounded-lg bg-muted p-4 mb-4">
                <p className="text-sm font-medium">Signed in as:</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <Field>
                <FieldLabel htmlFor="address">Address</FieldLabel>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 Main St, City, Country"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password (Optional)</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {password && (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Field>
              )}

              {(mutation.isError || errorMessage) && (
                <div className="text-red-500 text-sm space-y-1 p-3 bg-red-50 rounded">
                  <p className="font-semibold">Error:</p>
                  <p className="text-xs">{errorMessage || "Failed to update profile. Please try again."}</p>
                  {password && (
                    <p className="text-xs mt-2">Password requirements: min 6 characters, must contain 1 digit</p>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={mutation.isPending}
                  className="flex-1"
                >
                  {mutation.isPending ? "Saving..." : "Continue"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  disabled={mutation.isPending}
                >
                  Skip for now
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Sign out
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
