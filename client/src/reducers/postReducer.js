import {
  ADD_POST,
  //   GET_POSTS,
  //   //   GET_POST,
  //   DELETE_POST,
  POST_LOADING
} from "../actions/types";

const initialState = {
  posts: [],
  post: [],
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        loading: false
      };
    default:
      return state;
  }
}
