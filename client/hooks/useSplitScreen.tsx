import { useState, useEffect, useCallback } from "react";

export const useSplitScreen = (initialSplit = 50, minWidth = 200) => {
  const [splitPosition, setSplitPosition] = useState(initialSplit);
  const [isDragging, setIsDragging] = useState(false);
  const [leftVisible, setLeftVisible] = useState(true);
  const [rightVisible, setRightVisible] = useState(true);

  const handleMouseDown = useCallback(() => setIsDragging(true), []);
  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newPosition = (e.clientX / window.innerWidth) * 100;
        setSplitPosition(newPosition);
      }
    },
    [isDragging]
  );

  const toggleLeft = useCallback(() => {
    setLeftVisible((prev) => {
      if (prev && !rightVisible) return true; // Prevent hiding if right is not visible
      if (!prev && !rightVisible) setRightVisible(true); // Show right if left is being hidden
      return !prev;
    });
  }, [rightVisible]);

  const toggleRight = useCallback(() => {
    setRightVisible((prev) => {
      if (prev && !leftVisible) return true; // Prevent hiding if left is not visible
      if (!prev && !leftVisible) setLeftVisible(true); // Show left if right is being hidden
      return !prev;
    });
  }, [leftVisible]);

  // set visibility

  const showScreens = useCallback(() => {
    setRightVisible(true);
    setLeftVisible(true);
    setSplitPosition(initialSplit);
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
          setLeftVisible(true);
          setRightVisible(false);
        } else {
          setLeftVisible(false);
          setRightVisible(true);
        }
      } else {
        setLeftVisible(leftWidth >= minWidth);
        setRightVisible(rightWidth >= minWidth);
      }

      // Ensure at least one section is visible
      if (!leftVisible && !rightVisible) {
        if (leftWidth > rightWidth) {
          setLeftVisible(true);
        } else {
          setRightVisible(true);
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [splitPosition, minWidth]);

  return {
    splitPosition,
    isDragging,
    leftVisible,
    rightVisible,
    handleMouseDown,
    toggleLeft,
    toggleRight,
    showScreens
  };
};
