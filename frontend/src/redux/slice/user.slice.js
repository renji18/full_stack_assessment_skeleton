import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getAllUsers } from "../../api/api"

// Get All Users (handler)
export const handleGetAllUsers = createAsyncThunk(
  "getUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllUsers()
      return response?.data
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)

const userSlice = createSlice({
  name: "Users",
  initialState: {
    loading: false,
    error: null,
    data: [],
    status: "",
  },
  extraReducers: (builder) => {
    // Get All Users (builder)
    builder.addCase(handleGetAllUsers.pending, (state) => {
      state.status = "getting_users"
      state.loading = true
    })
    builder.addCase(handleGetAllUsers.fulfilled, (state, action) => {
      state.data = action.payload.users
      state.status = "success_getting_users"
      state.loading = false
    })
    builder.addCase(handleGetAllUsers.rejected, (state, action) => {
      state.error = action.payload.details
      state.loading = false
      state.status = "error_getting_users"
    })
  },
})

export default userSlice.reducer