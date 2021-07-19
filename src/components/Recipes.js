import styled from "styled-components";
import { Link, Route, useLocation } from "react-router-dom";
import SortingRecipes from "../screens/SortingRecipes";
import PageTitle from "./PageTitle";
import Header from "../components/Header";

const RecipesSortingBox = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RecipesSortingLink = styled.div`
  padding: 5px 10px;
  margin-right: 40px;
  font-size: 30px;
`;

export default function Recipes() {
  const location = useLocation();
  return (
    <div>
      <PageTitle title="레시피 보기" />
      <Header />
      <RecipesSortingBox>
        <RecipesSortingLink
          style={
            location?.pathname?.includes("recommand")
              ? { color: "tomato" }
              : { color: "black" }
          }
        >
          <Link to={`/recipes/recommand`}>👍 추천순</Link>
        </RecipesSortingLink>
        <RecipesSortingLink
          style={
            location?.pathname?.includes("recent")
              ? { color: "tomato" }
              : { color: "black" }
          }
        >
          <Link to={`/recipes/recent`}>⚡ 최신순</Link>
        </RecipesSortingLink>
      </RecipesSortingBox>
      <Route path="/recipes/:sorting">
        <SortingRecipes />
      </Route>
    </div>
  );
}
