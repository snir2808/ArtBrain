import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home(porps) {
  const { socket } = porps;
  const [index, setIndex] = useState("");
  const [restart, setRestart] = useState(false);

  const notify = (msg) => {
    let text = msg.text;
    if (text.includes("sale")) text = text + "!";
    if (text.includes("new") || text.includes("New")) text = "~~" + text + "~~";
    if (text.includes("limited edition"))
      text = text.replace("limited edition", "LIMITED EDITION");
    if (text.includes("Limited edition"))
      text = text.replace("Limited edition", "LIMITED EDITION");

    switch (msg.type) {
      case "info":
        return toast.info(`${text}`, {
          position: "top-center",
          autoClose: msg.time * 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          pauseOnFocusLoss: false,
        });
      case "warning":
        return toast.warning(`${text}`, {
          position: "top-center",
          autoClose: msg.time * 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          pauseOnFocusLoss: false,
        });
      case "success":
        return toast.success(`${text}`, {
          position: "top-center",
          autoClose: msg.time * 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          pauseOnFocusLoss: false,
        });
      case "error":
        return toast.error(`${text}`, {
          position: "top-center",
          autoClose: msg.time * 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          pauseOnFocusLoss: false,
        });
    }
  };

  useEffect(() => {
    socket.on("message", (msg) => {
      if (msg == false) {
        setRestart(true);
      } else {
        setIndex(msg.index);
        notify(msg);
      }
    });
  }, []);
  const markMessage = () => {
    socket.emit("click", index);
  };

  return (
    <div className="App">
      <div onClick={markMessage}>
        <ToastContainer />
        {restart ? (
          <h1 style={{ textAlign: "center" }}>
            No more new notifications, please refresh the page to get started
            again
          </h1>
        ) : null}
      </div>
    </div>
  );
}
