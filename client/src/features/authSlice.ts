// import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
// import publicAxios from "../fetchConfig/publicAxios"

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     currentUser: "auth",
//     isFetching: false,
//     errror: false
//   },
//   reducers: {},
//   extraReducers:(builder) => {
//     builder
//     .addCase(loginRedux.pending, (state)=> {
//       state.isFetching = true
//     })
//     .addCase(loginRedux.fulfilled, (state: any, action: any) => {
//       state.isFetching = false
//       state.currentUser = action.payload;
//     })
//   },
// })

// export const loginRedux = createAsyncThunk("auth/login",async ({email, password}: {email:string, password: string}) => {
//   try {
//     const result = await publicAxios.post(`/auth/login`, {})
//   } catch (error) {

//   }
// })

                              //jkjdvlkdsvdkmvdvk

// export default authSlice.reducer
