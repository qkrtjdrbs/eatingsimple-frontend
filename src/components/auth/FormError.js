import styled from "styled-components";

const SFormError = styled.p`
  height: 30px;
  padding: 10px 10px;
  font-weight: 500;
  text-align: center;
  color: #fff;
  width: 100%;
  background-color: #ff6060;
`;

export default function FormError({ message }) {
  return message === "" || !message ? null : <SFormError>{message}</SFormError>;
}
