import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../routes";

const Icon = styled.div`
  margin-right: 10px;
  color: ${(props) => props.theme.red};
`;
const Home = styled.span`
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 25px;
`;
const HomeAnchor = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function HomeLink() {
  return (
    <HomeAnchor href={routes.home}>
      <Icon>
        <FontAwesomeIcon icon={faUtensils} size="3x" />
      </Icon>
      <Home>모두의 레시피</Home>
    </HomeAnchor>
  );
}
