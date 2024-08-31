import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./slice/user.slice"
import homeSlice from "./slice/home.slice"


const store = configureStore({
  reducer: {
    users: userSlice,
    homes: homeSlice
  },
})

export default store