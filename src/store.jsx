import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "services/slice/UserSlice";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});