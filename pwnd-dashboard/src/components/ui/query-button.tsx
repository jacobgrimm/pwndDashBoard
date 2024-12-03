import { useQuery } from "@tanstack/react-query";
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import API_ENDPOINT from "@/api/api-def";

interface ButtonProps {
  query: string;
  setResponse: any;
  setLastEvaluatedKey: any;
}

//this button is in charge of making the API calls whenever it's onClick function is triggered
// it does this by using the refetch function returned from react-query's useQuery
const QueryButton: React.FC<ButtonProps> = ({
  query,
  setResponse,
  setLastEvaluatedKey,
}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["queryDB"],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINT + "/query?" + query, {
        headers: { Authorization: "Cool Cats" },
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
    if (data) {
      console.log(data);
      setLastEvaluatedKey(data.last_evaluated_key);
    }
  }, [data]);

  return (
    <div>
      <Button
        onClick={() => refetch()}
        colorPalette={"black"}
        color={"black"}
        variant={"solid"}
      >
        {isLoading ? "Loading..." : "Fetch Data"}
      </Button>
      {isError && <p style={{ color: "red" }}>Error occurred</p>}
    </div>
  );
};
export default QueryButton;
