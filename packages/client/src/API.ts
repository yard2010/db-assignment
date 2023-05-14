import axios from "axios";
import { API_URL } from "./config";

export type SearchResult = {
  title: string;
  url: string;
};

export type SearchResponse = {
  results: SearchResult[];
  currentPage: number;
  pagesCount: number;
};

export const search = async (query: string, page: number) => {
  const response = await axios.get<SearchResponse>(`${API_URL}/results`, {
    params: { query: query, page: page },
  });
  return response.data;
};

export const fetchRecentQueries = async () => {
  const response = await axios.post(`${API_URL}/recent-queries`);
  return response.data;
};
