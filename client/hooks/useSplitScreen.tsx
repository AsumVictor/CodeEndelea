import {
  setLeftVisible,
  setRightVisible,
  setSplitPosition,
  showScreens,
  toggleLeft,
  toggleRight,
} from "@/redux/slices/SplitScreen";
import { RootState } from "@/redux/Store";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useSplitScreen = (initialSplit = 50, minWidth = 200) => {
  // const [splitPosition, setSplitPosition] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  // const [leftVisible, setLeftVisible] = useState(true);
  // const [rightVisible, setRightVisible] = useState(true);
  const dispatch = useDispatch();
  const { splitPosition, leftVisible, rightVisible } = useSelector(
    (state: RootState) => state.splitScreen
  );

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = (e.clientX / window.innerWidth) * 100;
        dispatch(setSplitPosition(newPosition));
      }
    },
    [isDragging]
  );

  const toggleLeftPannel = useCallback(() => {
    dispatch(toggleLeft());
    setSplitPosition(0);
  }, [rightVisible]);

  const toggleRightPannel = useCallback(() => {
    dispatch(toggleRight());
  }, [leftVisible]);

  // set visibility

  const showScreensAll = useCallback(() => {
    dispatch(showScreens())
  }, [leftVisible]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  useEffect(() => {
    const handleResize = () => {
      const leftWidth = (window.innerWidth * splitPosition) / 100;
      const rightWidth = window.innerWidth - leftWidth;

      if (leftWidth < minWidth && rightWidth < minWidth) {
        // If both sections are too small, show the larger one
        if (leftWidth > rightWidth) {
          dispatch(setLeftVisible(true));
          dispatch(setRightVisible(false));
        } else {
          dispatch(setLeftVisible(false));
          dispatch(setRightVisible(true));
        }
      } else {
        dispatch(setLeftVisible(leftWidth >= minWidth));
        dispatch(setRightVisible(rightWidth >= minWidth));
      }

      // Ensure at least one section is visible
      if (!leftVisible && !rightVisible) {
        if (leftWidth > rightWidth) {
          dispatch(setLeftVisible(true));
        } else {
          dispatch(setRightVisible(true));
        }
      }

      if (!leftVisible) {
        dispatch(setSplitPosition(0));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [splitPosition, minWidth]);

  return {
    isDragging,
    handleMouseDown,
    toggleLeftPannel,
    toggleRightPannel,
    showScreensAll,
  };
};
