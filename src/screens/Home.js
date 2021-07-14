import { gql, useQuery } from "@apollo/client";
import Photo from "../components/feed/Photo";
import PageTitle from "../components/PageTitle";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { darkModeVar, disableDarkMode, enableDarkMode } from "../apollo";
import { useReactiveVar } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { logUserOut } from "../apollo";
import { COMMENT_FRAGMENT, PHOTO_FRAGMENT } from "../fragments";

const FEED_QUERY = gql`
  query seeFeed {
    seeFeed {
      ...PhotoFragment
      user {
        username
        avatar
      }
      caption
      comments {
        ...CommentFragment
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT}
  ${COMMENT_FRAGMENT}
`;

const DarkModeBtn = styled.span`
  cursor: pointer;
`;

function Home() {
  const { data } = useQuery(FEED_QUERY);
  return (
    <div>
      <button onClick={logUserOut}>Log out!</button>
      <DarkModeBtn onClick={localStorage.DARK_MODE ? disableDarkMode : enableDarkMode}>
                    <FontAwesomeIcon icon={localStorage.DARK_MODE ? faSun : faMoon} />
      </DarkModeBtn>
      <PageTitle title="Home" />
      {data?.seeFeed?.map((photo) => (
        <Photo key={photo.id} {...photo} />
      ))}
    </div>
  );
}
export default Home;