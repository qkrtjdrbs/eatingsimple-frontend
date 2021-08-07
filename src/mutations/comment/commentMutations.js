import gql from "graphql-tag";

export const TOGGLE_COMMENT_LIKE = gql`
  mutation toggleCommentLike($id: Int!) {
    toggleCommentLike(id: $id) {
      ok
    }
  }
`;
export const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($id: Int!) {
    deleteComment(id: $id) {
      ok
    }
  }
`;
export const EDIT_COMMENT_MUTATION = gql`
  mutation editComment($id: Int!, $payload: String!) {
    editComment(id: $id, payload: $payload) {
      ok
    }
  }
`;

export const WRITE_COMMENT_MUTATION = gql`
  mutation writeComment($recipeId: Int!, $payload: String!) {
    writeComment(recipeId: $recipeId, payload: $payload) {
      id
      user {
        username
        avatar
      }
      payload
      isMine
      isLiked
      likes
      createdAt
    }
  }
`;

export const WRTIE_NESTED_COMMENT_MUTATION = gql`
  mutation writeNestedComment($nestingId: Int!, $payload: String!) {
    writeNestedComment(nestingId: $nestingId, payload: $payload) {
      id
      user {
        username
        avatar
      }
      payload
      isMine
      isLiked
      likes
      createdAt
    }
  }
`;
