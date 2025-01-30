"use client";
import React, { useEffect, useState } from "react";
import CodeSpace from "../../../../components/editorStudio/index";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";

function Page() {
  const editorState = useSelector((state: RootState) => state.codeEditor);
  const screenState = useSelector((state: RootState) => state.codeEditor);
  const canvasState = useSelector((state: RootState) => state.codeEditor);

  const [seconds, setSeconds] = useState(0);
  const [start, setStart] = useState(false); // Declare a start state
  const [stateHistory, setStateHistory] = useState<
    Map<number, { editorState: any; screenState: any; canvasState: any }>
  >(new Map());

  const updateStateHistory = () => {
    const currentState = {
      editorState,
      screenState,
      canvasState,
    };

    // Create a new Map to avoid directly mutating the state
    const updatedHistory = new Map(stateHistory);
    updatedHistory.set(seconds, currentState); // Use seconds as the key

    // Save the updated history to localStorage
    localStorage.setItem(
      "stateHistory",
      JSON.stringify(Array.from(updatedHistory.entries()))
    ); // Convert Map to Array for storage

    // Update the state history in the component state
    setStateHistory(updatedHistory);
  };

  // Update the seconds counter every second, but only if 'start' is true
  useEffect(() => {
    if (!start) return; // Don't start the timer if 'start' is false

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000); // Increment seconds every second

    return () => clearInterval(interval); // Clean up the interval when the component is unmounted
  }, [start]); // Re-run the effect when 'start' changes

  useEffect(() => {
    if (seconds % 3 === 0 && seconds !== 0) {
      updateStateHistory();
      console.log(window.localStorage.getItem("stateHistory"))
    }
  }, [seconds]);

  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for changes in localStorage
    window.addEventListener("storage", (event) => {
      if (event.key === "sharedData") {
        const newMessage = JSON.parse(event.newValue || "{}");
        setMessage(newMessage.message); // Update state with the new message
      }
    });

    return () => {
      window.removeEventListener("storage", () => {});
    };
  }, []);

  // You can control when the timer starts by updating the 'start' state
  const handleStart = () => setStart(true);
  const handleStop = () => setStart(false);

  return (
    <div>
      <CodeSpace />
      <button onClick={handleStart}>Start Timer</button>
      <button onClick={handleStop}>Stop Timer</button>
    </div>
  );
}

export default Page;
