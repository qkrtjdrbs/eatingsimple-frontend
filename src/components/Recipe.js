import styled from "styled-components";
import Slider from "react-slick";
import { PropTypes, shape } from "prop-types";

const ContentBox = styled.div`
  margin: 15px 0px;
  padding: 10px 20px;
  border-top: 1px solid gray;
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
`;
const Image = styled.img`
  height: 500px;
`;

export default function Recipe({ content, photos }) {
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
};
