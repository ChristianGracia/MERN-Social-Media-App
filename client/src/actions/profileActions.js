import axios from "axios";

import { GET_PROFILE, PROFILE_LOADING, GET_ERROS } from "../types";

// get current profile
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading);
};
