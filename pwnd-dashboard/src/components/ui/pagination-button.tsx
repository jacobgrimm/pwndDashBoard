import { HiArrowCircleRight } from "react-icons/hi";
import { IconButton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import API_ENDPOINT from "@/api/api-def";
import { useEffect, useState } from "react";

interface ButtonProps {
  query: string;
  setResponse: any;
  lastEvaluatedKey: any;
  setLastEvaluatedKey: any;
}

//This button is in charge of pagination, whenever clicked it makes the pagination request to the server
//Returns request to through setResponse up to the parents components
//lastEvaluatedKey is the required query parameter for our pagination
const PaginationButton: React.FC<ButtonProps> = ({
  query,
  setResponse,
  lastEvaluatedKey,
  setLastEvaluatedKey,
}) => {
  const [extendedQuery, setExtendedQuery] = useState("");

  const { data, refetch } = useQuery({
    //this is the query and is set to be disabled until button click at which refetch is called
    queryKey: ["queryDB"],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINT + "/query?" + extendedQuery, {
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
      setLastEvaluatedKey(data.last_evaluated_key);
    }
  }, [data]);

  useEffect(() => {
    //here is how we create the new request based on the previous one to paginate with the lastEvaluatedKey
    setExtendedQuery(
      query +
        "&" +
        new URLSearchParams({
          last_evaluated_key: lastEvaluatedKey,
        }).toString()
    );
  }, [query, lastEvaluatedKey]);

  return (
    <IconButton
      variant={"solid"}
      color={"black"}
      onClick={() => refetch()}
      colorPalette={"black"}
      disabled={!lastEvaluatedKey}
    >
      <HiArrowCircleRight />
    </IconButton>
  );
};
export default PaginationButton;
