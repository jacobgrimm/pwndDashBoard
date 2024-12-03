import "./App.css";
import SearchPage from "./pages/search-page";

//App just serves as a high level component for our searchPage, since this is a real, single page app!
function App() {
  return (
    <>
      <SearchPage></SearchPage>
    </>
  );
}

export default App;
