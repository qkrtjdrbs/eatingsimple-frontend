import styled from "styled-components";
import Input from "../auth/Input";
import { NoPhotoNotice } from "./NoPhotoNotice";

export const Photos = styled(Input)``;
export const Photo = styled.img`
  object-fit: contain;
  width: 100%;
`;
export const Notice = styled(NoPhotoNotice)`
  background-color: ${(props) => props.theme.red};
  width: 50%;
  text-align: center;
`;
