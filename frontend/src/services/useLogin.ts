import { useMutation } from "@tanstack/react-query";

type LoginRequest = { email: string; password: string };
type LoginResponse = { user_id: number; message: string };

export function useLogin() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: LoginRequest): Promise<LoginResponse> => {
      const res = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        let msg = "Login failed";
        try {
          const data = await res.json();
          msg = data.error || data.message || JSON.stringify(data);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      return res.json();
    },
    retry: false,
  });
}
