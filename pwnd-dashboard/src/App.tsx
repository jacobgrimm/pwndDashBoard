import "./App.css";
import SearchPage from "./pages/search-page";
import Navbar from "./components/ui/navbar";
import { Flex, Box, Spinner } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { lazy, Suspense } from "react";

const AboutPage = lazy(() => import("./pages/about-page"));
const WhyPage = lazy(() => import("./pages/why-page"));

//App just serves as a high level component for our searchPage, since this is a real, single page app!
function App() {
  return (
    <Router>
      <Flex direction="column" align="center" justify="flex-start" minH="100vh">
        <Navbar></Navbar>
        <Box
          as="main"
          mt="80px"
          w="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Suspense fallback={<Spinner size="xl" />}>
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/why" element={<WhyPage />} />
            </Routes>
          </Suspense>
        </Box>
      </Flex>
    </Router>
  );
}

export default App;
