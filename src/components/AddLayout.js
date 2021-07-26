import styled from "styled-components";

const Container = styled.div`
  display: flex;
  height: 100vh;
  margin-top: 100px;
  align-items: center;
  flex-direction: column;
`;

const Wrapper = styled.div`
  max-width: 600px;
  width: 100%;
`;

function AddLayout({ children }) {
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
}

export default AddLayout;
