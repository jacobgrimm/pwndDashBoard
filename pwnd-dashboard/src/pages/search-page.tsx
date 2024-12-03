import { useState } from "react";
import { Heading } from "@chakra-ui/react";
import SearchBar from "@/components/ui/search-bar";
import ResultsTable, {
  ApiResponseObject,
} from "../components/ui/results-table";

function SearchPage() {
  const [apiResponse, setApiResponse] = useState<ApiResponseObject>();
  return (
    <div>
      <Heading>Pwnd Dashboard</Heading>
      <SearchBar setApiResponse={setApiResponse} />
      {apiResponse && (
        <ResultsTable
          items={apiResponse.items}
          count={apiResponse.count}
          last_evaluated_key={apiResponse.last_evaluated_key}
        />
      )}
    </div>
  );
}

export default SearchPage;
