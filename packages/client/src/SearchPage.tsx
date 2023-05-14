import styled from "@emotion/styled";
import { ChangeEvent, useEffect, useState } from "react";
import { Pagination } from "./Pagination";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import {
  resetResults,
  fetchResultsThunk,
  changePageThunk,
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

const ColumnsContainer = styled.div({
  display: "flex",
});

const RecentQueries = styled.div({
  display: "flex",
  flexDirection: "column",
  width: "20%",
  flexShrink: 0,
  gap: "0.5rem",
  "& h1": {
    fontWeight: "bold",
    paddingBottom: "1rem",
  },
});

const Content = styled.div({
  flexGrow: 1,
});

export const SearchPage = () => {
  const [searchValue, setSearchValue] = useState("");

  const { currentPage, pagesCount, results, currentQuery } = useAppSelector(
    ({ search }) => search
  );

  useEffect(() => {
    currentQuery && setSearchValue(currentQuery);
  }, [currentQuery]);

  const recentQueries = useAppSelector((state) => state.search.recentQueries);

  const dispatch = useAppDispatch();

  const handleSearch = () => {
    dispatch(fetchResultsThunk(searchValue));
  };

  const handlePageChange = (page: number) => {
    dispatch(changePageThunk(page));
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(resetResults());
    setSearchValue(event.target.value);
  };

  const handleRecentQueryClick = (recentQuery: string) => {
    dispatch(fetchResultsThunk(recentQuery));
  };

  return (
    <Container>
      <Title>Search</Title>
      <ColumnsContainer>
        <RecentQueries>
          <h1>Recent Queries</h1>
          {recentQueries.map((recentQuery) => (
            <a href="#" onClick={() => handleRecentQueryClick(recentQuery)}>
              {recentQuery}
            </a>
          ))}
        </RecentQueries>
        <Content>
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
                setCurrentPage={handlePageChange}
                currentPage={currentPage}
                pagesCount={pagesCount || 0}
              />
            </PaginationContainer>
          )}
        </Content>
      </ColumnsContainer>
    </Container>
  );
};
