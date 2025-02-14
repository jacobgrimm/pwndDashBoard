import { useState } from "react";
import { Heading, Image } from "@chakra-ui/react";
import SearchBar from "@/components/ui/search-bar";

import ResultsTable, {
  ApiResponseObject,
} from "../components/ui/results-table";

//This page is used to organize all of the children elements below
//As it renders the Header along with having children being resultsTable and the search bar functionality
//Most importantly here is where the apiResponse object is created
function SearchPage() {
  const [apiResponse, setApiResponse] = useState<ApiResponseObject>();
  return (
    <>
      {!apiResponse && (
        <Image src="https://i.pcmag.com/imagery/lineups/02Wn8IYRd6ICKePO9IlsEs2-1.fit_lim.size_1600x900.v1569492838.jpg" />
      )}
      <Heading>
        Welcome to leakd, here you are able to search emails and find passwords
        leaked found through our database of combolists.
      </Heading>
      <div>
        <SearchBar setApiResponse={setApiResponse} />
        {apiResponse && (
          <ResultsTable
            items={apiResponse.items}
            count={apiResponse.count}
            last_evaluated_key={apiResponse.last_evaluated_key}
          />
        )}
      </div>
    </>
  );
}

export default SearchPage;
