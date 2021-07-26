import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const theme = {
  blue: "#0095f6",
  red: "#F7323F",
  yellow: "#F7C93F",
  green: "#26cc49",
  lightGreen: "#20C997",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
    body {
        font-family: "Jua", sans-serif;
    }
    input {
        all:unset;
    }
    * {
        box-sizing:border-box;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    
`;
