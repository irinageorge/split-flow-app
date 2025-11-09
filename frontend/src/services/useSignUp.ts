import { useMutation } from "@tanstack/react-query";

type SignUpRequest = {
  username: string;
  email: string;
  password: string;
};

type SignUpResponse = {
  password: string;
  email: string;
  username: string;
  id: number;
};

export function useSignUp() {
  return useMutation({
    mutationFn: async (payload: SignUpRequest): Promise<SignUpResponse> => {
      const res = await fetch(
        "http://127.0.0.1:8000/accounts/bill-list-create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        let msg = "Sign up request failed";
        try {
          const data = await res.json();
          msg = data.error || data.message || JSON.stringify(data);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      return await res.json();
    },
  });
}
