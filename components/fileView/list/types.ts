
// a single column in table
export type Column<T> = {

  // unique key of the cell (same as key in row)
  key: string;

  // column heading
  heading: string;

  // callback to render the column data
  render: (row: T, key: string) => React.ReactNode;
};
