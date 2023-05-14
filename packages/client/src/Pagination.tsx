import styled from "@emotion/styled";

const Container = styled.div({
  display: "flex",
  gap: "1rem",
  "& a": {
    textDecoration: "none",
  },
});

const PageAnchor = styled.a(({ $isSelected }: { $isSelected: boolean }) => ({
  ...($isSelected ? { fontWeight: "bold", opacity: 1 } : {}),
}));

type PaginationProps = {
  currentPage: number;
  pagesCount: number;
  setCurrentPage: (page: number) => void;
};

export const Pagination = ({
  setCurrentPage,
  currentPage,
  pagesCount,
}: PaginationProps) => {
  return (
    <Container>
      {[...Array(pagesCount).keys()].map((index) => (
        <PageAnchor
          key={`page${index}`}
          onClick={() => setCurrentPage(index + 1)}
          $isSelected={currentPage - 1 === index}
          href="#"
        >
          {index + 1}
        </PageAnchor>
      ))}
    </Container>
  );
};
