import { loaduser, logout, setpageloading } from "./userSlice";
import Axios from "../Axios";

export const asyncloaduser = (id) => async (dispatch) => {
  try {
    dispatch(setpageloading(true));
    const { data } = await Axios.post("/me", { _id: id });

    if (data) {
      dispatch(loaduser(data));
    }
  } catch (err) {
    // dispatch(errors(err?.response?.data?.message));
    console.log(err);
  } finally {
    dispatch(setpageloading(false));
  }
};

export const asynclogout = () => async (dispatch) => {
  try {
    dispatch(setpageloading(true));
    window.localStorage.removeItem("id");
    dispatch(logout());
    dispatch(setpageloading(false));
  } catch (err) {
    dispatch(errors(err.response.data.message));
  }
};
