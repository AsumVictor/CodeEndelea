import { configureStore } from "@reduxjs/toolkit";
import codeEditorSlice from "./slices/EditorSlices";
import splitScreenReducer from "./slices/SplitScreen";
import canvasEditorReducer from "./slices/whiteBoard";

export const store = configureStore({
  reducer: {
    codeEditor: codeEditorSlice,
    splitScreen: splitScreenReducer,
    canvasEditor: canvasEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
