import React from "react";
import CodeEditor from "../codeEditor/editor";
import WhiteBoard from "../whiteboard/index";
import { SplitScreen } from "../screens/SplitScreen";

function CodeStudio() {
  return <SplitScreen LeftPage={<WhiteBoard />} RightPage={<CodeEditor />} />;
}

export default CodeStudio;
