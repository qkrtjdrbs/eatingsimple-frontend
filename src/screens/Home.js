import styled from "styled-components";
import { Foods } from "../components/Foods";
import PageTitle from "../components/PageTitle";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const Billboard = styled.div`
  position: relative;
  height: 500px;
`;
const Image = styled.img`
  height: 500px;
`;
const SearchBoard = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  height: 70px;
  width: 500px;
  margin: -35px 0 0 -250px;
  border: 2px solid black;
  background-color: white;
`;
const Search = styled.input`
  padding: 5px 15px;
  &:focus::placeholder {
    color: transparent;
  }
`;
const Button = styled.button`
  border: none;
  &:hover {
    cursor: pointer;
  }
`;

export default function Home() {
  const history = useHistory();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
    // 화면에 올리면 슬라이더가 자동으로 넘어가지 않음
    pauseOnHover: true,
  };
  const { register, handleSubmit, formState, clearErrors } = useForm({
    mode: "onChange",
  });
  const onSubmit = ({ search }) => {
    history.push(`search/recipes/${search}`);
  };
  const clearSearchError = () => {
    clearErrors("search");
  };
  return (
    <div>
      <PageTitle title="홈" />
      <Billboard>
        <Slider {...settings}>
          {Foods?.map((food, index) => (
            <Image key={index} src={food} />
          ))}
        </Slider>
        <SearchBoard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Button type="submit" disabled={!formState.isValid}>
              <FontAwesomeIcon icon={faSearch} size="2x" />
            </Button>
            <Search
              {...register("search", {
                required: true,
              })}
              type="text"
              onFocus={clearSearchError}
              placeholder="오늘 뭐 먹지?"
            />
          </form>
        </SearchBoard>
      </Billboard>
    </div>
  );
}
