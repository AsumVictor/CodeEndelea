// features/splitScreenSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SplitScreenState {
  splitPosition: number;
  leftVisible: boolean;
  rightVisible: boolean;
}

const initialState: SplitScreenState = {
  splitPosition: 50,
  leftVisible: true,
  rightVisible: true,
};

const splitScreenSlice = createSlice({
  name: "splitScreen",
  initialState,
  reducers: {
    setSplitPosition: (state, action: PayloadAction<number>) => {
      state.splitPosition = action.payload;
    },
    toggleLeft: (state) => {
      if (state.leftVisible && !state.rightVisible) {
        state.leftVisible = true;
        return;
      }
      if (!state.leftVisible && !state.rightVisible) {
        state.rightVisible = true;
      }

      state.leftVisible = !state.leftVisible;
      state.splitPosition = 0;
    },
    toggleRight: (state) => {
      if (state.rightVisible && !state.leftVisible) {
        state.rightVisible = true;
        return;
      }
      if (!state.rightVisible && !state.leftVisible) {
        state.leftVisible = true;
      }

      state.rightVisible = !state.rightVisible;
    },
    showScreens: (state) => {
      state.leftVisible = true;
      state.rightVisible = true;
      state.splitPosition = 50;
    },
    setLeftVisible: (state, action: PayloadAction<boolean>) => {
      state.leftVisible = action.payload;
    },
    setRightVisible: (state, action: PayloadAction<boolean>) => {
      state.rightVisible = action.payload;
    },
    setScreenStateTo: (state, action: PayloadAction<SplitScreenState>) => {
      state.splitPosition = action.payload.splitPosition;
      state.leftVisible = action.payload.leftVisible;
      state.rightVisible = action.payload.rightVisible;
    },
  },
});

export const {
  setSplitPosition,
  setScreenStateTo,
  toggleLeft,
  toggleRight,
  showScreens,
  setRightVisible,
  setLeftVisible,
} = splitScreenSlice.actions;

export default splitScreenSlice.reducer;
