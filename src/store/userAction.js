import { loaduser, setpageloading } from "./userSlice";
import Axios from "../Axios";

export const asyncloaduser = () => async (dispatch) => {
  try {
    dispatch(setpageloading());
    const { data } = await Axios.get("/me");

    if (data.success) {
      dispatch(loaduser(data.user));
    }
  } catch (err) {
    // dispatch(errors(err?.response?.data?.message));
    console.log(err);
  }
};

export const asynclogout = () => async (dispatch) => {
  try {
    dispatch(setpageloading(true));
    await Axios.get("/logout");
    window.localStorage.removeItem("location");
    dispatch(updatelocation(null));
    dispatch(logout());
    dispatch(setpageloading(false));
  } catch (err) {
    dispatch(errors(err.response.data.message));
  }
};
