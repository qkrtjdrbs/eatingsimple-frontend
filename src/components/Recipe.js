import styled from "styled-components";
import Slider from "react-slick";
import { PropTypes, shape } from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../routes";

const ContentBox = styled.div`
  margin: 15px 0px;
  padding: 10px 20px;
  border-top: 1px solid ${(props) => props.theme.lightGreen};
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
const Description = styled.div`
  width: 100%;
  height: auto;
  font-size: 20px;
  margin-bottom: 10px;
  white-space: pre-line;
  line-height: 1.7rem;
`;
const Image = styled.img`
  height: 500px;
`;
export const TagBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: 20px;
`;
export const Tag = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: ${(props) => props.theme.lightGreen};
  padding: 5px 10px;
  color: white;
  margin: 0px 10px;
  border-radius: 15px;
`;
export default function Recipe({ content, photos, tags }) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <ContentBox>
      <Description>{content}</Description>
      <Slider {...settings}>
        {photos?.map((photo) => (
          <Image key={photo.id} src={photo.file} />
        ))}
      </Slider>
      {tags?.length > 0 ? (
        <TagBox>
          <FontAwesomeIcon icon={faTags} />
          {tags?.map((tag) => (
            <Link key={tag.id} to={`${routes.tagResult}/${tag.tag.substr(1)}`}>
              <Tag>{tag.tag}</Tag>
            </Link>
          ))}
        </TagBox>
      ) : null}
    </ContentBox>
  );
}

Recipe.propTypes = {
  content: PropTypes.string,
  photos: PropTypes.arrayOf(
    shape({
      id: PropTypes.number.isRequired,
      file: PropTypes.string.isRequired,
    })
  ),
  tags: PropTypes.arrayOf(
    shape({
      id: PropTypes.number.isRequired,
      tag: PropTypes.string.isRequired,
    })
  ),
};
