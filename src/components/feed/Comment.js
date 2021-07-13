import { gql, useMutation } from "@apollo/client";
import React from "react";
import sanitizeHtml from "sanitize-html";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FatText } from "../shared";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// trash-alt
import {
    faTrashAlt
} from "@fortawesome/free-regular-svg-icons";

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
      error
    }
  }
`;

const CommentContainer = styled.div`
  margin-bottom: 7px;
`;

const CommentCaption = styled.span`
  margin-left: 10px;
  a {
    background-color: inherit;
    color: #0095f6;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DelteAction = styled.span`
  cursor: pointer;
  float: right;
`;
function Comment({ id, author, payload, photoId, isMine }) {
    const CommentUpdate = (cache, result) => {
        const {
          data: {
            deleteComment: { ok },
          },
        } = result;
        
        if (ok) {
          cache.modify({
            id: `Photo:${photoId}`,
            fields: {
              comments({DELETE}) {
                return DELETE;;
              },
              commentNumber(prev) {
                return prev - 1;
              },
            },
          });
        }
      };

    const [delteMutation] = useMutation(DELETE_COMMENT_MUTATION, {
        variables: {
            id,
        },
        update: CommentUpdate,
      });

    
    const deletIcon = id && isMine ? <DelteAction onClick={delteMutation}>
    <FontAwesomeIcon icon={faTrashAlt} />
    </DelteAction> : null
  return (
    <CommentContainer>
      <Link to={`/users/${author}`}>
        <FatText>{author}</FatText>
      </Link>
      <CommentCaption>
        {payload.split(" ").map((word, index) =>
          /#[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]+/.test(word) ? (
            <React.Fragment key={index}>
              <Link to={`/hashtags/${word}`}>{word}</Link>{" "}
            </React.Fragment>
          ) : (
            <React.Fragment key={index}>{word} </React.Fragment>
          )
        )}
      </CommentCaption>
      {deletIcon}
    </CommentContainer>
  );
}

Comment.propTypes = {
  isMine: PropTypes.bool,
  id: PropTypes.number,
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  payload: PropTypes.string.isRequired,
};

export default Comment;