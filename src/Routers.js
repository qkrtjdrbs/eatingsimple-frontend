import { routes } from "./routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./screens/Home";
import Header from "./components/Header";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import SearchResult from "./screens/SearchResult";
import Recipes from "./components/Recipes";
import AddRecipe from "./screens/AddRecipe";
import Profile from "./screens/Profile";
import EditRecipe from "./screens/EditRecipe";

export function MainRouter() {
  return (
    <Router>
      <Switch>
        <Route path={routes.home} exact>
          <Header />
          <Home />
        </Route>
        <Route path={routes.login} exact>
          <Login />
        </Route>
        <Route path={routes.signUp} exact>
          <SignUp />
        </Route>
        <Route path={routes.addRecipe} exact>
          <Header />
          <AddRecipe />
        </Route>
        <Route path={routes.recipes}>
          <Recipes />
        </Route>
        <Route path={`/recipe/:id`} exact>
          <EditRecipe />
        </Route>
        <Route path={`/user/:username`} exact>
          <Header />
          <Profile />
        </Route>
        <Route path={`/search/:keyword`}>
          <Header />
          <SearchResult />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
