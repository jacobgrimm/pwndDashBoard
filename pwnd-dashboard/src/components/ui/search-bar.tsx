import { useState } from "react";
import { HStack, Stack } from "@chakra-ui/react";

import QueryButton from "./query-button";
import SelectRadio from "@/components/ui/select-radio";
import PaginationButton from "./pagination-button";

interface SearchBarProps {
  setApiResponse: (response: any) => void;
}

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
