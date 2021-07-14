import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

export const theme = {
  blue: "#0095f6",
};

export const GlobalStyles = createGlobalStyle`
    ${reset}
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
