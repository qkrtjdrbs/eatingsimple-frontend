import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { isLoggedInVar, logUserOut } from "../apollo";

export const ME_QUERY = gql`
  query me {
    me {
      username
      avatar
    }
  }
`;

function useMe() {
  const hasToken = useReactiveVar(isLoggedInVar);
  //if not logged in, skip
  //Just in case the token is broken, ME_QUERY does not use Apollo Client cache.
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken,
    fetchPolicy: "no-cache",
  });
  //It works whenever data changes after it is first operated.
  useEffect(() => {
    //there is a token on LS but the token did not work on the backend
    if (data?.me === null) {
      logUserOut();
    }
  }, [data]);
  return { data };
}

export default useMe;
