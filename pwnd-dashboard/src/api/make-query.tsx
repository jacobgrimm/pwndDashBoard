import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import API_ENDPOINT from "@/api/api-def";

interface QueryInput {
  query: string;
  execute: boolean;
  setResponse: any;
}

const MakeQuery: React.FC<QueryInput> = ({ query, execute, setResponse }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["fetchData"],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINT + "/query" + query, {
        headers: { Authorization: "Bearer Token" },
      });
      console.log(response);
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    },
    enabled: false, // Disable automatic fetching
  });

  useEffect(() => {
    // Return API Call Data to App through setResponse
    setResponse(data);
  }, [data]);
  useEffect(() => {
    refetch();
  }, [execute]);

  return (
    <>
      {isError && <p style={{ color: "red" }}>Error occurred</p>}
      {isLoading && <p>Loading</p>}
    </>
  );
};
export default MakeQuery;
