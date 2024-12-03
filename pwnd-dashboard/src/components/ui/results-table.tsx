import { Table } from "@chakra-ui/react";

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
//simple table to display API results as they come in
const ResultsTable: React.FC<ApiResponseObject> = (
  //Table for displaying the items found in Query to API
  ApiResponse
) => {
  return (
    <div>
      {
        //only render TABLE if there is actual data to render
        <div>
          <Table.Root key={"Results"} size={"md"}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>Domain</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">
                  Password
                </Table.ColumnHeader>
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
        </div>
      }
    </div>
  );
};
export default ResultsTable;
