import { Table, Box, HStack, Stack } from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination";
import { useState } from "react";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";

export interface responseItem {
  //Individual DB items
  email: string;
  username: string;
  domain: string;
  password: string;
}

export interface ApiResponseObject {
  //API JSON response model
  items: Array<responseItem>;
  count: Number;
  last_evaluated_key: string;
}

const pageSize = 5;
const count = 50;
const items = new Array(count)
  .fill(0)
  .map((_, index) => `Lorem ipsum dolor sit amet ${index + 1}`);

//simple table to display API results as they come in
const ResultsTable: React.FC<ApiResponseObject> = (
  //Table for displaying the items found in Query to API
  ApiResponse
) => {
  const [page, setPage] = useState(1);

  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const visibleItems = items.slice(startRange, endRange);

  return (
    //only render TABLE if there is actual data to render
    <Box w="100%" maxW="100vw" overflowX="auto">
      <Table.Root
        display={{ base: "none", md: "inherit" }}
        p={2}
        m={0}
        key={"Results"}
        size={"md"}
        striped={true}
      >
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Username</Table.ColumnHeader>
            <Table.ColumnHeader>Domain</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Password</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {ApiResponse.items &&
            ApiResponse.items.length > 0 &&
            ApiResponse.items.map((item) => (
              <Table.Row key={item.email}>
                <Table.Cell>{item.email}</Table.Cell>
                <Table.Cell>{item.username}</Table.Cell>
                <Table.Cell>{item.domain}</Table.Cell>
                <Table.Cell textAlign="end">{item.password}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
      <AccordionRoot
        collapsible
        display={{ base: "block", md: "none" }}
        p={2}
        m={0}
      >
        {ApiResponse.items &&
          ApiResponse.items.length > 0 &&
          ApiResponse.items.map((item) => (
            <AccordionItem key={item.email} value={item.email}>
              <AccordionItemTrigger>{item.email}</AccordionItemTrigger>
              <AccordionItemContent>
                Email: {item.email} <br />
                Username: {item.username} <br />
                Domain: {item.domain} <br />
                Password: {item.password} <br />
              </AccordionItemContent>
            </AccordionItem>
          ))}
      </AccordionRoot>

      <Stack gap="4">
        <PaginationRoot
          page={page}
          count={count}
          pageSize={pageSize}
          onPageChange={(e) => {
            setPage(e.page);
            console.log(e);
          }}
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Stack>
    </Box>
  );
};
export default ResultsTable;
