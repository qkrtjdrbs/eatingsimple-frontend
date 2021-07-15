import styled from "styled-components";

const LoginBtn = styled.button`
  display: block;
  width: 100%;
  height: 50px;
  margin-top: 16px;
  border-radius: 6px;
  font-size: 16px;
  line-height: 56px;
  color: #fff;
  background-color: ${(props) => props.theme.red};
  text-align: center;
  border: none;
  cursor: ${(props) => (props.disabled ? null : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.2 : 1)};
`;

export default LoginBtn;
