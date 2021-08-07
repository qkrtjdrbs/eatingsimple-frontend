import { useMutation } from "@apollo/client";
import { faImages } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Loader from "react-loader-spinner";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Slider from "react-slick";
import styled from "styled-components";
import AddLayout from "../components/recipeWriteForm/AddLayout";
import Button from "../components/auth/Button";
import FormError from "../components/auth/FormError";
import FormsContainer from "../components/auth/FormsContainer";
import { Content, ContentBox } from "../components/recipeWriteForm/Content";
import PageTitle from "../components/PageTitle";
import { Notice, Photo, Photos } from "../components/recipeWriteForm/Photo";
import { PhotoContainer } from "../components/recipeWriteForm/PhotoContainer";
import { Title } from "../components/recipeWriteForm/Title";
import HomeLink from "../components/HomeLink";
import { faFolderOpen, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import {
  DELETE_PHOTO_MUTATION,
  EDIT_RECIPE_MUTATION,
} from "../mutations/recipe/recipeMutations";

const EditLayout = styled(AddLayout)``;
const Delete = styled.div`
  font-size: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
`;
const ExPhotoBox = styled(ContentBox)`
  position: relative;
  z-index: 9;
  &:hover {
    .slick-current {
      opacity: 0.5;
    }
    ${Delete} {
      opacity: 1;
    }
  }
`;
const ExPhoto = styled(Photo)`
  cursor: pointer;
`;
const OldAndNew = styled.div`
  font-size: 25px;
  font-weight: 600;
  margin-top: 30px;
`;
const NoPhotos = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 2;
`;

export default function EditRecipe() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const history = useHistory();
  const location = useLocation();
  let { id } = useParams();
  const {
    state: { title, content, photos },
  } = location;
  const [exPhotos, setExPhotos] = useState(photos);
  const [newPhotos, setNewPhotos] = useState(null);
  const {
    register,
    handleSubmit,
    clearErrors,
    formState,
    formState: { errors },
    setValue,
    setError,
  } = useForm({ mode: "onChange" });
  const onCompleted = (data) => {
    const {
      editRecipe: { ok, error },
    } = data;
    if (ok) {
      history.push(`/recipes/recent/${id}`, { id });
    } else {
      setError("result", error);
    }
  };
  const [editRecipe, { loading }] = useMutation(EDIT_RECIPE_MUTATION, {
    onCompleted,
  });
  const [deletePhoto] = useMutation(DELETE_PHOTO_MUTATION);
  useEffect(() => {
    setValue("title", title);
    setValue("content", content);
  }, [title, content, setValue]);
  const onValid = (data) => {
    id = parseInt(id);
    editRecipe({ variables: { id, ...data } });
  };
  const onPhotoClick = async (e) => {
    const {
      target: { currentSrc: file },
    } = e;
    if (
      window.confirm(
        "사진을 삭제할 경우 복구할 수 없습니다.\n정말 사진을 삭제할까요?"
      )
    ) {
      await deletePhoto({ variables: { file } });
      setExPhotos(exPhotos.filter((photo) => photo.file !== file));
    }
  };
  const onChange = (e) => {
    const {
      target: { files },
    } = e;
    if (!files) {
      setNewPhotos(null);
      return;
    }
    let fileList = [];
    for (let i = 0, f; (f = files[i]); i++) {
      const reader = new FileReader();
      reader.onload = () => {
        fileList.push(reader.result);
        if (fileList.length === files.length) setNewPhotos(fileList);
      };
      reader.readAsDataURL(f);
    }
  };
  return (
    <EditLayout>
      <PageTitle title="수정" />
      <HomeLink />
      <FormsContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <FormError message={errors?.result?.message} />
          <Title
            {...register("title", { required: true })}
            type="text"
            placeholder="제목을 입력해주세요"
            onFocus={() => clearErrors("result")}
          />
          <Content
            {...register("content", { required: true })}
            type="text"
            placeholder="레시피에 대한 간단한 설명을 써주세요"
            onFocus={() => clearErrors("result")}
          />
          <OldAndNew>
            <FontAwesomeIcon icon={faFolderOpen} /> 기존 사진들
          </OldAndNew>
          {exPhotos ? (
            <ExPhotoBox>
              <Slider {...settings}>
                {exPhotos.map((photo, index) => (
                  <ExPhoto
                    alt="preview"
                    key={index}
                    src={photo.file}
                    onClick={onPhotoClick}
                  />
                ))}
              </Slider>
              <Delete>❌ 삭제</Delete>
            </ExPhotoBox>
          ) : (
            <NoPhotos>사진이 없어요</NoPhotos>
          )}
          <OldAndNew>
            <FontAwesomeIcon icon={faFolderPlus} /> 사진 추가
          </OldAndNew>
          {newPhotos ? (
            <ContentBox>
              <Slider {...settings}>
                {newPhotos.map((photo, index) => (
                  <Photo alt="preview" key={index} src={photo} />
                ))}
              </Slider>
            </ContentBox>
          ) : (
            <PhotoContainer>
              <FontAwesomeIcon icon={faImages} size="9x" />
              <Notice>등록된 사진이 없어요</Notice>
            </PhotoContainer>
          )}
          <Photos
            {...register("files")}
            onChange={onChange}
            type="file"
            multiple
          />
          <Button type="submit" disabled={!formState.isValid || loading}>
            {loading ? (
              <Loader
                type="Circles"
                color="white"
                height={20}
                width={20}
                timeout={3000}
              />
            ) : (
              "작성"
            )}
          </Button>
        </form>
      </FormsContainer>
    </EditLayout>
  );
}
