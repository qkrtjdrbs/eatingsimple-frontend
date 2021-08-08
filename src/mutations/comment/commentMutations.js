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

export const DELETE_NESTED_COMMENT_MUTATION = gql`
  mutation deleteNestedComment($id: Int!) {
    deleteNestedComment(id: $id) {
      ok
      error
    }
  }
`;

export const EDIT_NESTED_COMMENT_MUTATION = gql`
  mutation editNestedComment($id: Int!, $payload: String!) {
    editNestedComment(id: $id, payload: $payload) {
      ok
    }
  }
`;

export const TOGGLE_NESTED_COMMENT_LIKE = gql`
  mutation toggleNestedCommentLike($id: Int!) {
    toggleNestedCommentLike(id: $id) {
      ok
    }
  }
`;
