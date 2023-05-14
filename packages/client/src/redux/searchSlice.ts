import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SearchResponse } from "../API";

type SearchState = SearchResponse;

const initialState: SearchState = {
  pagesCount: 0,
  currentPage: 1,
  results: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<SearchResponse>) => {
      state.results = action.payload.results;
      state.currentPage = action.payload.currentPage;
      state.pagesCount = action.payload.pagesCount;
    },
    resetResults: (state) => {
      state.results = [];
      state.currentPage = 1;
      state.pagesCount = 0;
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setResults, changePage, resetResults } = searchSlice.actions;

export default searchSlice.reducer;
