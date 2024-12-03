import { useState } from "react";
import { HStack, Stack } from "@chakra-ui/react";

import QueryButton from "./query-button";
import SelectRadio from "@/components/ui/select-radio";
import PaginationButton from "./pagination-button";

interface SearchBarProps {
  setApiResponse: (response: any) => void;
}
//this higher level component serves to organize the radioInput along with the buttons that make the query's through their onClick handler
//this component also manages the Query to be able to send it to the query buttons
const SearchBar: React.FC<SearchBarProps> = ({ setApiResponse }) => {
  const [query, setQuery] = useState("");
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState("");

  return (
    <div>
      <div>
        <HStack>
          <Stack>
            <SelectRadio setQuery={setQuery} />
          </Stack>
          <Stack>
            <QueryButton
              query={query}
              setResponse={setApiResponse}
              setLastEvaluatedKey={setLastEvaluatedKey}
            ></QueryButton>
            <PaginationButton
              query={query}
              setResponse={setApiResponse}
              lastEvaluatedKey={lastEvaluatedKey}
              setLastEvaluatedKey={setLastEvaluatedKey}
            ></PaginationButton>
          </Stack>
        </HStack>
      </div>
    </div>
  );
};

export default SearchBar;
