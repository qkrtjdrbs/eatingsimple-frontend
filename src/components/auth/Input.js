import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  border-radius: 3px;
  padding: 7px;
  height: 50px;
  background-color: #fafafa;
  border: 0.5px solid rgb(219, 219, 219);
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 15px;
  }
  &:focus {
    border-color: ${(props) => (props.hasError ? "tomato" : "#018af4")};
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

export default Input;
