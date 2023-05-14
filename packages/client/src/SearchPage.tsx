import styled from "@emotion/styled";
import { ChangeEvent, useState } from "react";
import { Pagination } from "./Pagination";
import { search } from "./API";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  resetResults,
  setResults,
  changePage as changePageAction,
} from "./redux/searchSlice";

const Container = styled.div({
  display: "flex",
  flexDirection: "column",
});

const Title = styled.div({
  textAlign: "center",
  padding: "2rem 0",
  fontSize: "2rem",
});

const Control = styled.div({
  display: "flex",
  gap: "0.5rem",
  "& input": {
    width: "60%",
  },
  justifyContent: "center",
});

const Results = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "2rem",
  alignItems: "center",
});

const Result = styled.a({
  width: "80%",
});

const PaginationContainer = styled.div({
  display: "flex",
  justifyContent: "center",
});

export const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");

  const { currentPage, pagesCount, results } = useAppSelector(
    ({ search }) => search
  );
  const dispatch = useAppDispatch();

  const handleSearch = async () => {
    fetchResults(searchValue, currentPage);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(resetResults());
    setSearchValue(event.target.value);
  };

  // TODO: move to action
  const fetchResults = async (query: string, page: number) => {
    const response = await search(query, page);
    dispatch(setResults(response));
  };

  const changePage = (page: number) => {
    dispatch(changePageAction(page));
    fetchResults(searchValue, page);
  };

  return (
    <Container>
      <Title>Search</Title>
      <Control>
        <input
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </Control>
      <Results>
        {results.map((result) => (
          <Result key={result.url} href={result.url}>
            {result.title}
          </Result>
        ))}
      </Results>
      {results.length > 0 && (
        <PaginationContainer>
          <Pagination
            setCurrentPage={changePage}
            currentPage={currentPage}
            pagesCount={pagesCount || 0}
          />
        </PaginationContainer>
      )}
    </Container>
  );
};
