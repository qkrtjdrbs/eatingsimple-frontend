import { useReactiveVar } from "@apollo/client";
import {
  faBars,
  faPencilAlt,
  faSignOutAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { isLoggedInVar, logUserOut } from "../apollo";
import { routes } from "../routes";
import FatText from "./FatText";
import HeaderLoginBtn from "./HeaderLoginBtn";
import { Link } from "react-router-dom";
import useMe from "../hooks/useMe";
import Avatar from "./auth/Avatar";

const HeaderContainer = styled.header`
  width: 100%;
  padding: 18px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Jua", sans-serif;
`;

const Wrapper = styled.div`
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MenuBtn = styled.div`
  width: 30px;
  transition: 0.5s;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.blue} 1s;
  }
`;

const slideLeft = keyframes`
  from {
    transform: translateX(-250px);
  }
  to {
    transform: translateX(0px);
  }
`;

const MenuContainer = styled.div`
  width: 250px;
  height: auto;
  position: fixed;
  left: 0;
  top: 79px;
  z-index: 9999;
  padding: 20px;
  background-color: white;
  border: 1px solid rgba(44, 44, 44, 0.137);
  box-shadow: 2px 0px 1px rgba(44, 44, 44, 0.137);
  animation: ${slideLeft} 0.25s ease-out forwards;
`;

const MenuItem = styled.div`
  font-weight: 700;
  border-bottom: 1px solid rgba(44, 44, 44, 0.137);
  display: flex;
  padding: 15px;
  &:hover {
    color: ${(props) => props.theme.blue};
  }
`;

const HeaderItem = styled.div`
  font-size: 20px;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const LogoutBtn = styled.div`
  color: ${(props) => props.theme.red};
  &:hover {
    cursor: pointer;
  }
`;

export default function Header() {
  const [toggleMenu, setToggleMenu] = useState(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { data } = useMe();
  return (
    <HeaderContainer>
      <Wrapper>
        <HeaderItem>
          {toggleMenu ? (
            <>
              <MenuBtn onClick={() => setToggleMenu(!toggleMenu)}>
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </MenuBtn>
              <MenuContainer>
                <MenuItem>
                  <Icon>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </Icon>
                  <Link to={isLoggedIn ? routes.addRecipe : routes.login}>
                    새 레시피 쓰기
                  </Link>
                </MenuItem>
                {isLoggedIn ? (
                  <MenuItem>
                    <Icon>
                      <FontAwesomeIcon icon={faSignOutAlt} />
                    </Icon>
                    <LogoutBtn onClick={() => logUserOut()}>로그아웃</LogoutBtn>
                  </MenuItem>
                ) : null}
              </MenuContainer>
            </>
          ) : (
            <MenuBtn onClick={() => setToggleMenu(!toggleMenu)}>
              <FontAwesomeIcon icon={faBars} size="lg" />
            </MenuBtn>
          )}
        </HeaderItem>
        <HeaderItem>
          <FatText>
            <Link to={routes.home}>모두의 레시피</Link>
          </FatText>
        </HeaderItem>
        <HeaderItem>
          {isLoggedIn ? (
            <Link to={`/users/${data?.me?.username}`}>
              <Avatar url={data?.me?.avatar} />
            </Link>
          ) : (
            <HeaderLoginBtn />
          )}
        </HeaderItem>
      </Wrapper>
    </HeaderContainer>
  );
}
