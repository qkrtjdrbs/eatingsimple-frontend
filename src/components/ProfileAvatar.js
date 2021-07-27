import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const SAvatar = styled.div`
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Img = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`;

export default function ProfileAvatar({ url = "" }) {
  return (
    <SAvatar>
      {url ? <Img src={url} /> : <FontAwesomeIcon icon={faUser} size="10x" />}
    </SAvatar>
  );
}
