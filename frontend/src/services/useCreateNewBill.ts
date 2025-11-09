import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "../store/store";

type CreateRequest = { title: string; location: string; };

type CreateResponse = {
  id: number;
  title: string;
  created_by: number;
  created_on: string;
  is_closed: boolean;
  entries: any[];
};

export function useCreateNewBill() {
  const userId = useSelector((state: RootState) => state.authSlice.userId);

  return useMutation({
    mutationFn: async ({
      title,
      location,
    }: CreateRequest): Promise<CreateResponse> => {
      const res = await fetch("http://127.0.0.1:8000/splitflow/create-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, account_id: userId, location: location }),
      });

      if (!res.ok) {
        let msg = "The new bill creation failed";
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
