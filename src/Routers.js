import { routes } from "./routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./screens/Home";
import Header from "./components/Header";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import SearchedRecipes from "./screens/SearchedRecipes";
import Recipes from "./components/Recipes";

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
          <h1>Add Recipe</h1>
        </Route>
        <Route path={routes.recipes}>
          <Recipes />
        </Route>
        <Route path={`/recipe/:id`} exact>
          <h1>recipe</h1>
        </Route>
        <Route path={`/user/:username`} exact>
          <h1>user</h1>
        </Route>
        <Route path={`/search/recipes/:keyword`} exact>
          <SearchedRecipes />
        </Route>
        <Route path={`/search/users/:keyword`} exact>
          <h1>recipes & users</h1>
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}