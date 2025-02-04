import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as fabric from "fabric";

interface CanvasEditorState {
  tool: string;
  color: string;
  size: number;
  content: string;
}

const initialState: CanvasEditorState = {
  tool: "draw",
  color: "#000000",
  size: 2,
  content: "",
};

const canvasEditorSlice = createSlice({
  name: "canvasEditor",
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<string>) => {
      state.tool = action.payload;
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.color = action.payload;
    },
    setSize: (state, action: PayloadAction<number>) => {
      state.size = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
  },
});

export const { setTool, setColor, setSize, setContent } =
  canvasEditorSlice.actions;

export default canvasEditorSlice.reducer;
