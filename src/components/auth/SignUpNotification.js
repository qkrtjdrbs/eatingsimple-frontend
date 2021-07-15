import styled from "styled-components";

const SNotification = styled.div`
  min-height: 28px;
  padding: 6px 12px;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.6px;
  text-align: center;
  color: #fff;
  background-color: #ff6060;
`;

export default function SignUpNotification({ children }) {
  return <SNotification>{children}</SNotification>;
}
