import { useState, useRef, useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal";
import { Input } from "../components/Form";
import Button from "../components/Button";
import toast from "react-hot-toast";
import {
  chat_with_llama,
  // downloadFile,
  get_messages,
  new_chat,
  reuploadFile,
  update_api_key,
  uploadFile,
  uploadLinkData,
  uploadYoutubeVideo,
} from "../api/llm";
import { MDRender } from "../components/MDRender";
import { FixedSizeArray } from "../constants/chatHistory";
import WritingText from "../components/writingText";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

export default function Chat() {
  const { id } = useParams();

  const [file, setFile] = useState({
    fileName: "",
    fileMime: "",
    linkUploaded: false,
  });
  const [focus, setFocus] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [convId, setConvId] = useState(id || "new");
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(false);

  const [isLinkSelected, setIsLinkSelected] = useState(false);

  // const suggestions = [
  //   "Explain me about stock market",
  //   "Hot news that happened around the world last week",
  //   "What is the imapct of AI in the present world and whats the further advances",
  // ];

  const router = useNavigate();

  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { user, setUser } = context;
  const chatHistory = useRef(new FixedSizeArray<string>(16)).current;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router("/auth?mode=login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const apiKeyRef = useRef<HTMLInputElement | null>(null);
  const LinkRef = useRef<HTMLInputElement | null>(null);

  const updateUserAndLocalStorage = (newConvId: string) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      convos: [...user.convos, newConvId],
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleNewChat = async (content: string) => {
    if (!user) return;
    const res = await new_chat(
      user.username,
      null,
      content
    );
    if (res.status === 200) {
      updateUserAndLocalStorage(res.data.id);
      setConvId(res.data.id);
      window.history.replaceState(null, "", `/chat/${res.data.id}`);
      await sendMessage(content, res.data.id);
    }
  };

  const handleUploadSuccess = () => {
    toast.success(
      "Successfully uploaded",
      {
        duration: 3000,
        style: {
          backgroundColor: "rgb(63 63 70)",
          color: "white",
          border: "2px solid rgb(82 82 91)",
        },
        iconTheme: {
          primary: "green",
          secondary: "white",
        },
      }
    );
  };

  const handleUploadError = (res: { data: { error: string } }) => {
    toast.error(res.data.error, {
      duration: 2000,
      style: {
        backgroundColor: "rgb(63 63 70)",
        color: "white",
        border: "2px solid rgb(82 82 91)",
      },
      iconTheme: {
        primary: "red",
        secondary: "white",
      },
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0 && user) {
      setLoading(true);
      if (convId === "new") {
        const res2 = await new_chat(
          user?.username || "",
          files[0],
          ""
          // user.groq_api_key || ""
        );
        if (res2.status === 200) {
          setConvId(res2.data.id);
          window.history.replaceState(null, "", `/chat/${res2.data.id}`);
          const res = await uploadFile(res2.data.id, files[0]);
          updateUserAndLocalStorage(res2.data.id);
          if (res.status === 200) {
            setFile({ fileName: files[0].name, fileMime: files[0].type, linkUploaded: false });
            handleUploadSuccess();
          }
        } else {
          handleUploadError(res2.data.error);
        }
      } else {
        const res = await uploadFile(convId, files[0]);
        if (res.status === 200) {
          setFile({ fileName: files[0].name, fileMime: files[0].type, linkUploaded: false });
          handleUploadSuccess();
        } else {
          handleUploadError(res.data.error);
        }
      }
      setLoading(false);
    }
  };

  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    console.log(e);
    if (files && user && file.fileName !== files[0].name && convId !== "new") {
      setLoading(true);
      const res = await reuploadFile(convId, files[0]);
      if (res.status === 200) {
        setFile({ fileName: files[0].name, fileMime: files[0].type, linkUploaded: false });
        handleUploadSuccess();
      } else {
        handleUploadError(res.data.error);
      }
      setLoading(false);
    } else {
      handleUploadError({
        data: {
          error: "you can't reupload the same file",
        },
      });
    }
  };

  const handleInput = () => {
    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;

      if (textarea.scrollHeight > 160) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  };

  const sendMessage = async (query: string, convId: string) => {
    if (convId != "new" && textAreaRef.current && user) {
      const res = await chat_with_llama(
        user.username,
        // user.groq_api_key,
        query,
        file.fileMime,
        file.linkUploaded,
        chatHistory.getItems(),
        convId
      );
      if (res && res.status === 200) {
        setMessages((prev) => [
          ...prev,
          { id: res.data.messageIds[0], text: query, sender: "user" },
        ]);
        setMessages((prev) => [
          ...prev,
          {
            id: res.data.messageIds[1],
            text: res.data.response.content,
            sender: "bot",
          },
        ]);
        textAreaRef.current.value = "";
        handleInput();
        chatHistory.addLastN(res.data.messageIds as string[]);
      } else {
        handleUploadError(res.data.error);
      }
    }
  };

  const handleSendQuery = async () => {
    if (textAreaRef.current) {
      const query = textAreaRef.current.value;
      if (!apiStatus) {
        setShowModal(true);
        return;
      }
      if (query && user) {
        try {
          setLoading(true);
          if (messages.length === 0 && convId === "new") {
            console.log(loading);
            await handleNewChat(query);
          }
          await sendMessage(query, convId);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          console.log(loading);
        }
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendQuery();
    }
  };

  const handleApiKey = async () => {
    if (apiKeyRef.current && user) {
      console.log(user._id);
      const res = await update_api_key(user._id, apiKeyRef.current.value);
      if (res.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, groq_api_key: apiKeyRef.current.value })
        );
        handleUploadSuccess();
        setApiStatus(true);
        await handleSendQuery();
        // setUser({ ...user, groq_api_key: apiKeyRef.current.value });
        setShowModal(false);
      } else {
        handleUploadError(
          res.data.error || {
            data: {
              error: "Something went wrong",
            },
          }
        );
      }
    }
  };

  const handleUploadYoutube = async (convId: string, videoUrl: string) => {
    const res = await uploadYoutubeVideo(convId, videoUrl);
    if (res.status === 200) {
      handleUploadSuccess();
    } else {
      handleUploadError(res);
    }
  };

  const handleLink = async () => {
    setIsLinkSelected(false);
    if (!LinkRef.current || !user) return;
    setLoading(true);
    try {
      if (convId !== "new") {
        await handleUploadYoutube(convId, LinkRef.current.value);
      } else {
        await handleNewChat(LinkRef.current.value);
        await handleUploadYoutube(convId, LinkRef.current.value);
      }
    } catch (error) {
      console.log(error);
      // handleUploadError("Failed to process the link");
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleMessages = async () => {
      if (convId != "new" && user && user._id) {
        try {
          const res = await get_messages(convId, user._id);
          console.log("hitting");

          if (res.status === 200) {
            setMessages(res.data.messages);
            setApiStatus(res.data.api_status);
            if (res.data.file) {
              setFile(res.data.file);
            }
            setFile(prev => ({...prev, linkUploaded: res.data.linkUploaded}));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            chatHistory.addLastN(res.data.messages.map((m: any) => m._id));
          }
        } catch (error) {
          console.log(error);
          handleUploadError({
              data: {
                error: "Something went wrong",
              },
            }
          );
        }
      }
    };
    handleMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <section className="px-4">
      {showModal && (
        <Modal
          title="Update Groq API"
          subTitle="Enter your groq api key"
          className="flex flex-col w-72 gap-2 bg-zinc-950 border-zinc-600"
        >
          <Input
            placeholder="Enter the groq api key"
            name="groq-key"
            inputRef={apiKeyRef}
          />
          <div className="flex flex-row gap-2">
            <Button
              text="Cancel"
              color1="bg-red-500"
              textColor1="text-white"
              color2="bg-zinc-950"
              onClick={() => setShowModal(false)}
            />
            <Button text="Save" onClick={handleApiKey} />
          </div>
        </Modal>
      )}
      {isLinkSelected && (
        <Modal
          title="Upload the page content"
          subTitle="Enter the link copieed"
          className="flex flex-col w-72 gap-2 bg-zinc-950 border-zinc-600"
        >
          <Input
            placeholder="Enter the link"
            name="page-link"
            InputType="url"
            inputRef={LinkRef}
          />
          <div className="flex flex-row gap-2">
            <Button
              text="Cancel"
              color1="bg-red-500"
              textColor1="text-white"
              color2="bg-zinc-950"
              onClick={() => setIsLinkSelected(false)}
            />
            <Button text="Save" onClick={handleLink} />
          </div>
        </Modal>
      )}
      <div className="text-center mt-4">
        {file.fileName.length !== 0 && (
          <div className="flex flex-row mb-6 gap-1 relative w-fit justify-center mx-auto">
            <h2 className="font-medium text-zinc-400 max-w-[28ch] whitespace-nowrap truncate overflow-hidden tracking-wide">
              {file.fileName} uploaded successfully
            </h2>
            <img src="../src/assets/file-check.svg" alt="ok" />
            <div className="absolute -right-10">
              <input
                type="file"
                name="reupload"
                className="w-8 -translate-y-1 -translate-x-1 file:hover:cursor-pointer opacity-0"
                id="reupload"
                accept="image/jpeg, image/png, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain"
                onChange={handleReupload}
              />
              <img
                src="../src/assets/replace.svg"
                className="w-6 -translate-y-[1.9rem] pointer-events-none"
                alt="re-upload"
              />
            </div>
          </div>
        )}
      </div>
      {/* //TODO: Some UI Fixes here :) */}
      {!file.fileName.length && messages.length === 0 ? (
        // <div className="mt-4 w-72 p-4 mx-auto flex flex-col gap-1 items-center">
        //   <input
        //     type="file"
        //     multiple
        //     name="file-input"
        //     id="input"
        //     onChange={handleFileUpload}
        //     accept="image/jpeg, image/png, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain"
        //     className="file:mr-4 w-72 file:py-2 file:px-4 px-4 p-2 rounded-lg border-2 border-zinc-700 bg-black file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-violet-700 file:text-zinc-100 hover:file:bg-zinc-950 hover:file:text-violet-100 cursor-pointer file:transition-all file:cursor-pointer"
        //   />
        //   <div className="relative">
        //     <input
        //       type="url"
        //       placeholder="paste the copied link here"
        //       className="bg-black text-sky-600 border-2 border-zinc-700 rounded-lg px-4 py-[0.375rem] w-72"
        //     />
        //     <button className="absolute font-medium top-1 right-1 rounded-lg px-2 py-1 bg-zinc-100/75 backdrop-blur-sm text-zinc-900">
        //       Add
        //     </button>
        //   </div>
        //   <div className="flex mt-2 w-72 rounded-r-xl bg-yellow-950/80 gap-2">
        //     <div className="w-2 bg-yellow-400" />
        //     <div className="px-4 py-2">
        //       <p className="font-medium tracking-wide text-yellow-400">Note</p>
        //       <p className="tracking-wide text-zinc-200">
        //         Youtube video cant be conversed unless it has transcripts
        //       </p>
        //     </div>
        //   </div>
        // </div>
        <div className="text-2xl h-[calc(100vh-14.25rem)] font-semibold mx-auto w-fit">
          <WritingText
            text="Let's Learn Something New"
            className="relative top-1/2"
          />
        </div>
      ): (
        file.fileName.length !== 0 && (
          <div className="flex w-fit flex-row gap-2 mb-4 border top-0 sticky items-center mx-auto">
            <h1 className="text-zinc-400 font-semibold max-w-[28ch] whitespace-nowrap truncate overflow-hidden tracking-wide">
              {file.fileName} uploaded
            </h1>
            <img src="../src/assets/file-check.svg" className="w-6" alt="file" />
          </div>
        )
      )}
      <div className="flex flex-col gap-2 pb-20">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-row items-start gap-2">
            {message.sender === "bot" && (
              <img
                src="../src/assets/bot.svg"
                className="w-8 pt-2"
                alt="Chatbot"
              />
            )}
            <div
              className={`${
                message.sender === "user"
                  ? "ml-auto text-zinc-400 max-w-96 border-2 sm:border-0 px-6 py-2 rounded-xl sm:bg-black bg-zinc-900 border-zinc-800 sm:max-w-[36rem] font-semibold"
                  : "px-2 sm:px-4 sm:py-2 chat-block text-zinc-200 sm:bg-zinc-950 sm:border-2 border-zinc-800 overflow-x-auto rounded-xl w-full sm:w-[calc(100%-12rem)]"
              }`}
            >
              <MDRender mdString={message.text} />
              {/* {message.text} */}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex flex-row gap-2 w-[calc(100%-2rem)] max-w-[55rem] 
      justify-center items-center fixed bottom-20 left-1/2 -translate-x-1/2"
      >
        {!focus &&
          (textAreaRef?.current === null ||
            textAreaRef.current.value.length === 0) && (
            <>
              <div className="w-10 h-10 hover:invert transition-all relative aspect-square rounded-full">
                <input
                  type="file"
                  name="file-input"
                  className="absolute cursor-pointer file:cursor-pointer aspect-square w-10 h-10 rounded-full opacity-0 border"
                  accept="image/jpeg, image/png, application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, text/plain"
                  id="file-input"
                  onChange={handleFileUpload}
                />
                <img
                  src="../src/assets/file-plus.svg"
                  className="w-10 h-10 p-2 rounded-full pointer-events-none bg-zinc-800 cursor-pointer transition-all select-none"
                  tabIndex={0}
                  alt="file upload"
                />
              </div>
              <img
                src="../src/assets/link.svg"
                className="w-10 h-10 p-2 rounded-full bg-zinc-800 cursor-pointer
            hover:invert transition-all select-none"
                tabIndex={0}
                onClick={() => setIsLinkSelected(true)}
                alt="add link"
              />
            </>
          )}
        <textarea
          ref={textAreaRef}
          name="user-input"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          id="ui"
          rows={1}
          className="bg-zinc-900 input-container rounded-lg w-full border-2 border-zinc-600 py-2 px-4"
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          style={{
            overflowY: "auto",
            maxHeight: "160px",
            resize: "none",
          }}
        />
        {loading ? (
          <img
            src="../src/assets/spinner.svg"
            className="w-10 p-2 animate-spin"
            alt="loader"
          />
        ) : (
          <img
            src="../src/assets/send.svg"
            className="w-10 h-10 p-2 rounded-full bg-zinc-100 cursor-pointer
          hover:invert transition-all"
            tabIndex={0}
            alt="Send"
            onClick={handleSendQuery}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendQuery();
              }
            }}
          />
        )}
      </div>
    </section>
  );
}
