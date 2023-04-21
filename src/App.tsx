import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Search from "./Routes/Search";
import TV from "./Routes/TV";

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Header />
      <Switch>
        <Route
          path={["/tvs", "/tvs/:slideId/:tvId"]}
          component={() => <TV />}
        />
        <Route path={"/search"} component={() => <Search />} />
        {/* path를 array로 여러개 사용 가능 */}
        <Route
          path={["/", "/movies/:slideId/:movieId"]}
          component={() => <Home />}
        />
      </Switch>
    </Router>
  );
}

export default App;
