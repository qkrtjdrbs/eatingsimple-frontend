import styled, { keyframes } from "styled-components";
import { Foods } from "../components/Foods";
import PageTitle from "../components/PageTitle";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { routes } from "../routes";

const Billboard = styled.div`
  position: relative;
  height: 500px;
  margin-bottom: 80px;
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
  border: 5px solid black;
  border-radius: 25px;
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
  color: ${(props) => !props.disabled && props.theme.red};
  &:hover {
    cursor: pointer;
  }
`;
const BelowBox = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
`;
const Suggestion = styled.div`
  font-size: 50px;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const wiggle = keyframes`
   0% { transform: rotate(0deg); }
   80% { transform: rotate(0deg); }
   85% { transform: rotate(5deg); }
   95% { transform: rotate(-5deg); }
  100% { transform: rotate(0deg); }
`;

const GoToRecipes = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 200px;
  margin: -25px 0 0 -100px;
  padding: 10px 15px;
  background-color: ${(props) => props.theme.red};
  border-radius: 15px;
  animation: ${wiggle} 2s infinite;
  &:hover {
    cursor: pointer;
    animation: none;
  }
`;
const Icon = styled.div`
  color: white;
  margin-right: 10px;
`;
const Span = styled.div`
  color: white;
  font-size: 18px;
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
    history.push(`search/${search}`);
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
      <BelowBox>
        <Suggestion>어떤 레시피들이 있을까?</Suggestion>
        <Link to={routes.recipes}>
          <GoToRecipes>
            <Icon>
              <FontAwesomeIcon icon={faArrowRight} />
            </Icon>
            <Span>레시피 보러가기 😋</Span>
          </GoToRecipes>
        </Link>
      </BelowBox>
    </div>
  );
}
