import { Radio, RadioGroup } from "@/components/ui/radio";
import { useState, useEffect } from "react";
import { Input } from "@chakra-ui/react";
interface SelectRadioProps {
  setQuery: (query: string) => void;
}
//this radio and input combo work to handle the api input
//depending on values in the elements, it will the query using the setQuery input
const SelectRadio: React.FC<SelectRadioProps> = ({ setQuery }) => {
  const [radioValue, setRadioValue] = useState("query");
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };
  //depending on what option is selected, we will slightly alter the request we are preparing to send
  useEffect(() => {
    if (radioValue == "query") {
      const queryString = new URLSearchParams({
        //create a URLSearchParams object to safely handle input and then turn it into a string
        mode: "show",
      }).toString();
      setQuery(queryString);
    } else if (radioValue == "email") {
      const queryString = new URLSearchParams({
        email: inputValue,
        mode: "email",
      }).toString();
      setQuery(queryString);
    } else if (radioValue == "domain") {
      const queryString = new URLSearchParams({
        domain: inputValue,
        mode: "domain",
      }).toString();
      setQuery(queryString);
    }
  }, [inputValue, radioValue]);

  const handleRadioChange = (event: any) => {
    setRadioValue(event.target.value);
    setInputValue("");
  };

  return (
    <>
      <Input
        value={inputValue}
        onChange={handleInputChange}
        disabled={radioValue == "query"}
        placeholder={
          radioValue == "query"
            ? "Switch to Email/Domain modes to Search"
            : "Enter a " + radioValue + " to search"
        }
      />

      <RadioGroup
        key={"radio"}
        variant={"solid"}
        defaultValue={radioValue}
        spaceX="4"
        colorPalette="teal"
        onChange={handleRadioChange}
      >
        <Radio value="email">Email Search</Radio>
        <Radio value="domain">Domain Search </Radio>
        <Radio value="query">Show All </Radio>
      </RadioGroup>
    </>
  );
};
export default SelectRadio;
