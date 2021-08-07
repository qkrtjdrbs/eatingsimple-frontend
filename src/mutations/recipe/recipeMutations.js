import gql from "graphql-tag";

export const TOGGLE_RECIPE_LIKE_MUTATION = gql`
  mutation toggleRecipeLike($id: Int!) {
    toggleRecipeLike(id: $id) {
      ok
    }
  }
`;

export const DELETE_RECIPE_MUTATION = gql`
  mutation deleteRecipe($id: Int!) {
    deleteRecipe(id: $id) {
      ok
      error
    }
  }
`;

export const CREATE_RECIPE_MUTATION = gql`
  mutation createRecipe($title: String!, $content: String!, $files: [Upload]) {
    createRecipe(title: $title, content: $content, files: $files) {
      ok
      error
      id
    }
  }
`;

export const EDIT_RECIPE_MUTATION = gql`
  mutation editRecipe(
    $id: Int!
    $title: String
    $content: String
    $files: [Upload]
  ) {
    editRecipe(id: $id, title: $title, content: $content, files: $files) {
      ok
      error
    }
  }
`;
export const DELETE_PHOTO_MUTATION = gql`
  mutation deletePhoto($file: String!) {
    deletePhoto(file: $file) {
      ok
      error
    }
  }
`;
