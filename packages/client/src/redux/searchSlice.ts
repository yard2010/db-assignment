import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { search, SearchResponse } from "../API";
import { RootState } from "./store";

type SearchState = SearchResponse & {
  currentQuery: string | null;
};

const initialState: SearchState = {
  pagesCount: 0,
  currentPage: 1,
  results: [],
  currentQuery: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setResults: (
      state,
      action: PayloadAction<SearchResponse & { currentQuery: string }>
    ) => {
      state.results = action.payload.results;
      state.currentPage = action.payload.currentPage;
      state.pagesCount = action.payload.pagesCount;
      state.currentQuery = action.payload.currentQuery;
    },
    resetResults: (state) => {
      state = initialState;
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const fetchResultsThunk =
  (query: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const response = await search(query, getState().search.currentPage);
    dispatch(setResults({ ...response, currentQuery: query }));
  };

export const changePageThunk =
  (page: number): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    const currentQuery = getState().search.currentQuery;
    if (!currentQuery) {
      return;
    }
    dispatch(changePage(page));
    const response = await search(currentQuery, page);
    dispatch(setResults({ ...response, currentQuery }));
  };

export const { setResults, changePage, resetResults } = searchSlice.actions;

export default searchSlice.reducer;
