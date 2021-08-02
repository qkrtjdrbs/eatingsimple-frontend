import styled from "styled-components";

export const ContentBox = styled.div`
  width: 100%;
  margin: 15px 0px;
  padding: 10px 20px;
  .slick-prev:before {
    opacity: 1;
    color: black;
    left: 0;
  }
  .slick-next:before {
    opacity: 1;
    color: black;
  }
`;

export const Content = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 10px;
  height: 400px;
  border: 0.5px solid rgb(219, 219, 219);
  font-family: "Jua", sans-serif;
  font-size: 20px;
  &:focus {
    outline-color: ${(props) => props.theme.blue};
  }
  &::placeholder {
    font-family: "Jua", sans-serif;
    font-size: 20px;
  }
`;
