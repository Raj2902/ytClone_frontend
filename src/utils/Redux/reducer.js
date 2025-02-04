import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allVideosData: [],
  search: "",
  customSideBar: true,
};
const allVideosDataSlice = createSlice({
  name: "allVideosData",
  initialState,
  reducers: {
    setAllVideosData: (state, action) => {
      state.allVideosData = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    showCustomSidebar: (state, action) => {
      state.customSideBar = action.payload;
    },
  },
});
export const { setAllVideosData, setSearch, showCustomSidebar } =
  allVideosDataSlice.actions;
export default allVideosDataSlice.reducer;
