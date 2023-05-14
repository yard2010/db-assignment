import express from "express";
import axios from "axios";
import cors from "cors";
import fs from "fs";

const DUCKDUCKGO_ENDPOINT = "http://api.duckduckgo.com";
const PORT = 8000;
const RESULTS_PER_PAGE = 10;
const RECENT_QUERIES_FILENAME = "./recent-queries.txt";

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

  fs.appendFileSync(RECENT_QUERIES_FILENAME, query + "\n");

  res.send(paginateResults(results, RESULTS_PER_PAGE, currentPage));
});

app.post("/recent-queries", async (req, res) => {
  try {
    const recentQueries = fs.readFileSync(RECENT_QUERIES_FILENAME, "utf8");
    res.send(
      recentQueries
        .split("\n")
        .filter((query) => query)
        .reverse()
        .slice(0, 10)
    );
  } catch (e) {
    res.send([]);
  }
});

app.listen(PORT, () => {
  console.log(`server is running on localhost:${PORT}`);
});
