import { SearchPage } from "./SearchPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App() {
  return (
    <Provider store={store}>
      <SearchPage />
    </Provider>
  );
}

export default App;
