import { SearchPage } from "./SearchPage";

import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { fetchRecentQueriesThunk } from "./redux/searchSlice";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchRecentQueriesThunk());
  }, []);

  return <SearchPage />;
}

export default App;
