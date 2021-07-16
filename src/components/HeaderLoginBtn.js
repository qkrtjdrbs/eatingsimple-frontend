import { Link } from "react-router-dom";
import styled from "styled-components";
import { routes } from "../routes";

const Button = styled.div`
  padding: 10px 15px;
  border: 2px solid black;
  border-radius: 17px;
  font-weight: 700;
  transition: all 300ms ease;
  &:hover {
    cursor: pointer;
    background-color: ${(props) => props.theme.blue};
    border: 2px solid ${(props) => props.theme.blue};
    color: white;
  }
`;

export default function HeaderLoginBtn() {
  return (
    <Button>
      <Link to={routes.login}>로그인</Link>
    </Button>
  );
}
