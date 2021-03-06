import { gql, useMutation } from "@apollo/client";
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
import {
  faFolderOpen,
  faFolderPlus,
  faTags,
} from "@fortawesome/free-solid-svg-icons";
import {
  DELETE_PHOTO_MUTATION,
  EDIT_RECIPE_MUTATION,
} from "../mutations/recipe/recipeMutations";
import { Tag, TagBox } from "../components/Recipe";
import { Tags } from "../components/recipeWriteForm/Tags";
import parsingTagAndMention from "../parsingTagAndMention";

const DISCONNET_TAG_MUTATION = gql`
  mutation disconnectTag($id: Int!, $tag: String!) {
    disconnectTag(id: $id, tag: $tag) {
      ok
      error
    }
  }
`;

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
const DelTag = styled(Tag)`
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.red};
  }
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
    state: { title, content, photos, tags },
  } = location;
  const [exPhotos, setExPhotos] = useState(photos);
  const [newPhotos, setNewPhotos] = useState(null);
  const [exTags, setExTags] = useState(tags);
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
  const onTagDisconnected = (data) => {
    const {
      disconnectTag: { ok, error },
    } = data;
    if (!ok) {
      setError("result", error);
    }
  };
  const [editRecipe, { loading }] = useMutation(EDIT_RECIPE_MUTATION, {
    onCompleted,
  });
  const [deletePhoto] = useMutation(DELETE_PHOTO_MUTATION);
  const [disconnectTag] = useMutation(DISCONNET_TAG_MUTATION, {
    onCompleted: onTagDisconnected,
  });
  useEffect(() => {
    setValue("title", title);
    setValue("content", content);
  }, [title, content, setValue]);
  const onValid = (data) => {
    id = parseInt(id);
    let tags = parsingTagAndMention("tag", data.tags);
    editRecipe({ variables: { id, ...data, tags } }).catch(() =>
      setError("result", { message: "?????? ??????????????? ????????? ??????????????????." })
    );
  };
  const onPhotoClick = async (e) => {
    const {
      target: { currentSrc: file },
    } = e;
    if (
      window.confirm(
        "????????? ????????? ?????? ????????? ??? ????????????.\n?????? ????????? ????????????????"
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
  const onTagClick = (e) => {
    if (window.confirm("??? ????????? ????????????????")) {
      const {
        target: { innerText: tag },
      } = e;
      id = parseInt(id);
      disconnectTag({ variables: { id, tag } });
      setExTags(exTags.filter((exTag) => exTag.tag !== tag));
    }
  };
  return (
    <EditLayout>
      <PageTitle title="??????" />
      <HomeLink />
      <FormsContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <FormError message={errors?.result?.message} />
          <Title
            {...register("title", { required: true })}
            type="text"
            placeholder="????????? ??????????????????"
            onFocus={() => clearErrors("result")}
          />
          <Content
            {...register("content", { required: true })}
            type="text"
            placeholder="???????????? ?????? ????????? ????????? ????????????"
            onFocus={() => clearErrors("result")}
          />
          <Tags
            {...register("tags")}
            type="text"
            placeholder="??????????????? ?????? ????????????"
            onFocus={() => clearErrors("result")}
          />
          {exTags?.length ? (
            <TagBox>
              <FontAwesomeIcon icon={faTags} />
              {exTags?.map((tag) => (
                <DelTag key={tag.id} onClick={(e) => onTagClick(e)}>
                  {tag.tag}
                </DelTag>
              ))}
            </TagBox>
          ) : null}

          <OldAndNew>
            <FontAwesomeIcon icon={faFolderOpen} /> ?????? ?????????
          </OldAndNew>
          {exPhotos?.length ? (
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
              <Delete>??? ??????</Delete>
            </ExPhotoBox>
          ) : (
            <NoPhotos>????????? ?????????</NoPhotos>
          )}
          <OldAndNew>
            <FontAwesomeIcon icon={faFolderPlus} /> ?????? ??????
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
              <Notice>????????? ????????? ?????????</Notice>
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
              "??????"
            )}
          </Button>
        </form>
      </FormsContainer>
    </EditLayout>
  );
}
