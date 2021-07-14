import styled from "styled-components";

const SFatText = styled.span`
  font-weight: 700;
`;

export default function FatText({ children }) {
  return <SFatText>{children}</SFatText>;
}
