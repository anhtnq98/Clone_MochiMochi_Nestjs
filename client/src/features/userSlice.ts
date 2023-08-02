import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface userState {
  value: any;
}
const initialUserState: userState = {
  value: {},
};
export const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    changeUser: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
    },
  },
});
export const { changeUser } = userSlice.actions;
export default userSlice.reducer;
