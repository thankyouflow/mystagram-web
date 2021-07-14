import { gql, useQuery, useMutation } from "@apollo/client";
import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/auth/Button";
import PageTitle from "../components/PageTitle";
import { FatText } from "../components/shared";
import { PHOTO_FRAGMENT } from "../fragments";

const FOLLOW_USER_MUTATION = gql`
  mutation followUser($username: String!) {
    followUser(username: $username) {
      ok
    }
  }
`;

const UNFOLLOW_USER_MUTATION = gql`
  mutation unfollowUser($username: String!) {
    unfollowUser(username: $username) {
      ok
    }
  }
`;


const SEE_PROFILE_QUERY = gql`
  query seeProfile($username: String!) {
    seeProfile(username: $username) {
      firstName
      lastName
      username
      bio
      avatar
      photos {
        ...PhotoFragment
      }
      totalFollowing
      totalFollowers
      isMe
      isFollowing
    }
  }
  ${PHOTO_FRAGMENT}
`;

const Header = styled.div`
  display: flex;
`;
const Avatar = styled.img`
  margin-left: 50px;
  height: 160px;
  width: 160px;
  border-radius: 50%;
  margin-right: 150px;
  background-color: #2c2c2c;
`;
const Column = styled.div``;
const Username = styled.h3`
  font-size: 28px;
  font-weight: 400;
`;
const Row = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
`;
const List = styled.ul`
  display: flex;
`;
const Item = styled.li`
  margin-right: 20px;
`;
const Value = styled(FatText)`
  font-size: 18px;
`;
const Name = styled(FatText)`
  font-size: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-auto-rows: 290px;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 50px;
`;

const Photo = styled.div`
  background-image: url(${(props) => props.bg});
  background-size: cover;
  position: relative;
`;

const Icons = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.span`
  font-size: 18px;
  display: flex;
  align-items: center;
  margin: 0px 5px;
  svg {
    font-size: 14px;
    margin-right: 5px;
  }
`;

const Btn = styled.div`
display: flex;
`;

const IsMeBtnBox = styled.div`
margin: 30px 0px 0px 65px;
height: 35px;
width: 130px;
border-radius: 5%;
border: 1px solid ${(props) => props.theme.borderColor}
`;

const BtnBox = styled.div`
margin: 25px 5px 0px 26px;
height: 35px;
width: 90px;
border-radius: 5%;
border: 1px solid ${(props) => props.theme.borderColor}
`;

const PlayBtn = styled.div`
  cursor: pointer;
  text-align: center;
  line-height: 35px
`;


function Profile() {
  const { username } = useParams();
  const { data } = useQuery(SEE_PROFILE_QUERY, {
    variables: {
      username,
    },
  });

  let followText = data?.seeProfile?.isFollowing ? "unfollow" : "follow"

  const updateFollow = (cache, result) => {
    const ok = followText === "unfollow" ? result.data?.unfollowUser?.ok : result.data?.followUser?.ok;
    if (ok) {
        cache.modify({
          id: `User:${username}`,
          fields: {
            isFollowing(prev) {
              return !prev;
            },
            totalFollowers(prev) {
              if(followText === "unfollow"){
                return prev - 1;
              }
              else{
                return prev + 1;
              }
            },
          },
        });
    }
  };

  const [followMutation, { loading }] = useMutation(followText === "unfollow" ? UNFOLLOW_USER_MUTATION : FOLLOW_USER_MUTATION, {
    variables: {
      username,
    },
    update: updateFollow,
  });

  const followSubmit = () => {
    if (loading) {
      return;
    }
    followMutation()
  };

  const makeBox = data?.seeProfile?.isMe ?
   <Btn>
      <IsMeBtnBox>
      <PlayBtn>{"프로필 편집"}</PlayBtn>
      </IsMeBtnBox>
      </Btn> 
  : 
  <Btn>
  <BtnBox>
  <PlayBtn onClick={followSubmit}>{followText}</PlayBtn>
  </BtnBox>
  <BtnBox>
  <PlayBtn>{"message"}</PlayBtn>
  </BtnBox>
  </Btn>

  return (
    <div>
      <Header>
        <Avatar src={data?.seeProfile?.avatar} />
        <Column>
          <Row>
            <Username>{data?.seeProfile?.username}</Username>
          </Row>
          <Row>
            <List>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowers}</Value> followers
                </span>
              </Item>
              <Item>
                <span>
                  <Value>{data?.seeProfile?.totalFollowing}</Value> following
                </span>
              </Item>
            </List>
          </Row>
          <Row>
            <Name>
              {data?.seeProfile?.firstName}
              {"  "}
              {data?.seeProfile?.lastName}
            </Name>
          </Row>
          <Row>{data?.seeProfile?.bio}</Row>
        </Column>
      </Header>
      {makeBox}
      <Grid>
        {data?.seeProfile?.photos.map((photo) => (
          <Photo bg={photo.file}>
            <Icons>
              <Icon>
                <FontAwesomeIcon icon={faHeart} />
                {photo.likes}
              </Icon>
              <Icon>
                <FontAwesomeIcon icon={faComment} />
                {photo.commentNumber}
              </Icon>
            </Icons>
          </Photo>
        ))}
      </Grid>
    </div>
  );
}

export default Profile;
