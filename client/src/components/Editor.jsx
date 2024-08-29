import { useEffect, useState, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { Dialog, Box, Typography, List, ListItem, styled } from "@mui/material";
import { io } from "socket.io-client";

//style:

const Component = styled(Box)`
  background: #f9fbfd;
`;
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  ["link", "image", "video", "formula"],
  [{ header: 1 }, { header: 2 }],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }],
  [{ indent: "-1" }, { indent: "+1" }],
  // Remove or adjust this line:
  // [{ direction: "rtl" }],
  [{ size: ["small", false, "large", "huge"] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ["clean"],
];

// main component:
const Editor = () => {
  const [quill, setQuill] = useState();
  const [socket, setSocket] = useState();
  const editorRef = useRef(null); // Reference to the editor element

  useEffect(() => {
    if (editorRef.current) {
      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });
      setQuill(quillInstance);
    }
  }, [editorRef]);

  useEffect(() => {
    const socketServer = io("http://localhost:9000/");
    setSocket(socketServer);
    socketServer.on("connect", () => {
      console.log("Connected to server, socket ID:", socketServer.id);
    });
    socketServer.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });
    return () => {
      socketServer.disconnect();
    };
  }, []);

  // handle change in text editor and send to backend
  useEffect(() => {
    if (quill && socket) {
      const handleEditorChange = (delta, oldData, source) => {
        if (source !== "user") return;
        socket.emit("send-changes", delta);
      };

      quill.on("text-change", handleEditorChange);

      return () => {
        quill.off("text-change", handleEditorChange);
      };
    }
  }, [quill, socket]);

  useEffect(() => {
    if (quill && socket) {
      const handleEditorChangedelta = (delta) => {
        quill.updateContents(delta, "silent");
      };

      socket.on("recive-changes", handleEditorChangedelta);

      return () => {
        socket.off("recive-changes", handleEditorChangedelta);
      };
    }
  }, [quill, socket]);

  return (
    <Component>
      <Box ref={editorRef} id="container"></Box>
    </Component>
  );
};

export default Editor;
