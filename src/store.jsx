import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "services/UserSlice";

export default configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});