import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";

export interface isActiveState {
  value: string;
}
const initialActiveState: isActiveState = {
  value: "home",
};
export const isActiveSlice = createSlice({
  name: "isActive",
  initialState: initialActiveState,
  reducers: {
    changeIsActive: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { changeIsActive } = isActiveSlice.actions;
export default isActiveSlice.reducer;
