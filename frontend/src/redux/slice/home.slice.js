import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getHomesByUser } from "../../api/api"

// Get Homes For User (handler)
export const handleGetHomesForUsers = createAsyncThunk(
  "getHomes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await getHomesByUser(data?.user_id, data?.page)
      return { apiData: response?.data, user_id: data?.user_id, page: data?.page }
    } catch (error) {
      return rejectWithValue(error.response)
    }
  }
)

const userSlice = createSlice({
  name: "Home",
  initialState: {
    loading: false,
    error: null,
    data: [],
    status: "",
    user_id: null,
    page: null,
    totalPages: null
  },
  extraReducers: (builder) => {
    // Get All Users (builder)
    builder.addCase(handleGetHomesForUsers.pending, (state) => {
      state.status = "getting_homes"
      state.loading = true
    })
    builder.addCase(handleGetHomesForUsers.fulfilled, (state, action) => {
      state.data = action.payload.apiData
      state.user_id = action.payload.user_id
      state.page = action.payload.page
      state.totalPages = action.payload.apiData?.totalPages
      state.status = "success_getting_homes"
      state.loading = false
    })
    builder.addCase(handleGetHomesForUsers.rejected, (state, action) => {
      state.error = action.payload.details
      state.loading = false
      state.status = "error_getting_homes"
    })
  },
})

export default userSlice.reducer