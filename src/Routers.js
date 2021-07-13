import { routes } from "./routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from "./NotFound";

export default function MainRouter() {
  return (
    <Router>
      <Switch>
        <Route path={routes.home} exact>
          <h1>HOME</h1>
        </Route>
        <Route path={routes.login} exact>
          <h1>login</h1>
        </Route>
        <Route path={routes.signUp} exact>
          <h1>sign up</h1>
        </Route>
        <Route path={routes.addRecipe} exact>
          <h1>Add Recipe</h1>
        </Route>
        <Route path={routes.recipes} exact>
          <h1>recipes</h1>
        </Route>
        <Route path={`/recipes/:id`} exact>
          <h1>recipe</h1>
        </Route>
        <Route path={`/users/:username`} exact>
          <h1>user</h1>
        </Route>
        <Route path={`/search/:keyword`} exact>
          <h1>recipes & users</h1>
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
