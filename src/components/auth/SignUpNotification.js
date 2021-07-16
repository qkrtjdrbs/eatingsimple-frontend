import styled from "styled-components";

const SNotification = styled.div`
  height: 30px;
  padding: 10px 10px;
  font-weight: 500;
  text-align: center;
  color: #fff;
  width: 100%;
  background-color: #26cc49;
`;

export default function SignUpNotification({ children }) {
  return <SNotification>{children}</SNotification>;
}
