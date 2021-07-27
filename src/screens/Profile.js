import { useQuery } from "@apollo/client";
import { useLocation, useParams, useHistory } from "react-router-dom";
import AddLayout from "../components/AddLayout";
import gql from "graphql-tag";
import styled from "styled-components";
import ProfileAvatar from "../components/ProfileAvatar";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import parsingDate from "../parsingDate";

const Layout = styled(AddLayout)``;
const ProfileBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;
const UserInfo = styled.div`
  height: 200px;
  width: 400px;
  padding-left: 30px;
`;
const Username = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 15px;
`;
const Email = styled.div`
  font-size: 17px;
  margin-bottom: 10px;
`;
const Bio = styled.div`
  font-size: 20px;
  font-weight: 500;
  word-break: break-all;
  margin-bottom: 10px;
`;
const EditButton = styled(Button)`
  width: 100%;
  margin: auto;
`;
const CreateDate = styled.div`
  font-size: 15px;
  opacity: 0.5;
  width: 80%;
`;

const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      id
      name
      username
      email
      bio
      avatar
      isMe
      createdAt
    }
  }
`;

//받은 좋아요 수 추가 ?

export default function Profile() {
  const { username } = useParams();
  const { data } = useQuery(SEE_PROFILE_QUERY, { variables: { username } });
  const location = useLocation();
  const history = useHistory();
  const createdDate = parsingDate(data?.seeProfile?.createdAt);
  if (location?.state?.refresh) {
    history.replace();
    window.location.reload();
  }
  return (
    <Layout>
      <PageTitle title={username} />
      <ProfileBox>
        <ProfileAvatar url={data?.seeProfile?.avatar} />
        <UserInfo>
          <Username>{data?.seeProfile?.username}</Username>
          <Email>{data?.seeProfile?.email}</Email>
          <Bio>{data?.seeProfile?.bio}</Bio>
          <CreateDate>{createdDate} 생성</CreateDate>
        </UserInfo>
      </ProfileBox>
      {data?.seeProfile?.isMe ? <EditButton>프로필 수정</EditButton> : null}
    </Layout>
  );
}
