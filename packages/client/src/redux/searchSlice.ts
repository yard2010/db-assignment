import {
  AnyAction,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { fetchRecentQueries, search, SearchResponse } from "../API";
import { RootState } from "./store";

type SearchState = SearchResponse & {
  currentQuery: string | null;
  recentQueries: string[];
};

const initialState: SearchState = {
  pagesCount: 0,
  currentPage: 1,
  results: [],
  currentQuery: null,
  recentQueries: [],
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

      const currentQuery = action.payload.currentQuery;
      state.currentQuery = currentQuery;

      state.recentQueries = [currentQuery, ...state.recentQueries.slice(0, 9)];
    },
    resetResults: (state) => {
      return { ...initialState, recentQueries: state.recentQueries };
    },
    changePage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setRecentQueries: (state, action: PayloadAction<string[]>) => {
      state.recentQueries = action.payload;
    },
  },
});

export const fetchResultsThunk =
  (query: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch, getState) => {
    dispatch(resetResults());
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

export const fetchRecentQueriesThunk =
  (): ThunkAction<void, {}, unknown, AnyAction> => async (dispatch) => {
    const recentQueries = await fetchRecentQueries();
    dispatch(setRecentQueries(recentQueries));
  };

export const { setResults, changePage, resetResults, setRecentQueries } =
  searchSlice.actions;

export default searchSlice.reducer;
