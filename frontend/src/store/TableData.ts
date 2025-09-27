import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TableDataSliceType = {
  tableData: any[];
  selectedRowIds: string[];
};

const initialState: TableDataSliceType = {
  tableData: [],
  selectedRowIds: [],
};

const tableDataSlice = createSlice({
  name: "tableDataSlice",
  initialState,
  reducers: {
    setTableData: (state, action: PayloadAction<{ tableData: any[] }>) => {
      state.tableData = action.payload.tableData;
    },
    setSelectedRowIds: (state, action: PayloadAction<{ rowIds: string[] }>) => {
      state.selectedRowIds = action.payload.rowIds;
    },
  },
});

export const { setTableData, setSelectedRowIds } = tableDataSlice.actions;
export default tableDataSlice.reducer;
