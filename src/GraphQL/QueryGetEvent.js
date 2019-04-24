import gql from "graphql-tag";

export default gql(`
  query getEvent($id: ID!) {
    getEvent(id: $id){
      id
      name
      where
      when
      description
      comments{
        __typename
        items {
          commentId
          content
          createdAt
        }
      }
    }
    }
`);
