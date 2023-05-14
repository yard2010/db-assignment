import express from "express";
import axios from "axios";
import cors from "cors";

const DUCKDUCKGO_ENDPOINT = "http://api.duckduckgo.com";
const PORT = 8000;
const RESULTS_PER_PAGE = 10;

const app = express();

app.use(cors());

type SearchResult = { url: string; title: string };

const rawResultToSearchResult = (result: any): SearchResult => ({
  url: result.FirstURL,
  title: result.Text,
});

const paginateResults = <T>(
  results: T[],
  perPage: number,
  currentPage: number
) => {
  return {
    results: results.slice(
      currentPage * perPage,
      currentPage * perPage + perPage
    ),
    pagesCount: Math.floor(results.length / perPage),
    currentPage,
  };
};

app.get("/results", async (req, res) => {
  const { query } = req.query;
  const currentPage = Number(req.query.page) || 1;

  if (query === undefined) {
    throw new Error("no query specified");
  }

  const apiCallResponse = await axios.get(DUCKDUCKGO_ENDPOINT, {
    params: {
      q: query,
      format: "json",
    },
  });

  const results = apiCallResponse.data.RelatedTopics.flatMap(
    (rawResult: any) => {
      if (rawResult.Topics) {
        return rawResult.Topics.map(rawResultToSearchResult);
      } else {
        return rawResultToSearchResult(rawResult);
      }
    }
  );

  res.send(paginateResults(results, RESULTS_PER_PAGE, currentPage));
});

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
