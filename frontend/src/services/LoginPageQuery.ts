import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const useLoginPage = () => {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8000/accounts/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: "stlstlstl",
          email: "stl@gmail.scom",
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return await response.json();
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    // enabled: true,
  });

  return { isPending, isError, data, error };
};
