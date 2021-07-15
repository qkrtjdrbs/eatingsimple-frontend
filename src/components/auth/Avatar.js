import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const SAvatar = styled.div`
  width: 33px;
  height: 33px;
  box-sizing: border-box;
  border-radius: 50%;
  border-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Img = styled.img`
  width: 33px;
  height: 33px;
  object-fit: cover;
`;

function Avatar({ url = "" }) {
  return (
    <SAvatar>
      {url ? <Img src={url} /> : <FontAwesomeIcon icon={faUser} />}
    </SAvatar>
  );
}

export default Avatar;
