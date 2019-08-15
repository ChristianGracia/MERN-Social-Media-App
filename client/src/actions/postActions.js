import axios from "axios";
import { ADD_POST, GET_ERRORS, GET_POSTS, POST_LOADING } from "./types";
import { bindActionCreators } from "redux";

// add post
export const addPost = postData => dispatch => {
  dispatch(setPostLoading());
  axios
    .post("api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// get post
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  axios
    .get("api/posts/")
    .then(res =>
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    );
};

// set loading
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};
