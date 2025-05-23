import { useContext, useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import toast from "react-hot-toast";
import { remove_conversation } from "../api/llm";
import { ThemeContext } from "../context/ThemeProvider";

export default function ChatCard({
  chartTitle,
  chartSubTitle,
  fileName,
  firstMessage,
  conv_id,
  onClick,
}: {
  chartTitle: string;
  chartSubTitle?: string;
  fileName?: string;
  firstMessage: string;
  conv_id: string;
  onClick?: () => void;
}) {
  const [showMore, setShowMore] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { setUser } = context;
  const handleDelete = async () => {
    setShowMore(false);
    setIsDeleting(true);
    const res = await remove_conversation(conv_id);
    if (res.status === 200) {
      toast.success(res.data.success, {
        duration: 2000,
        style: {
          backgroundColor: "rgb(63 63 70)",
          color: "white",
          border: "2px solid rgb(82 82 91)",
        },
        iconTheme: {
          primary: "green",
          secondary: "white",
        },
      });
      const user_raw = localStorage.getItem("user");
      if (user_raw) {
        const user = JSON.parse(user_raw);
        user.convos = user.convos.filter((id: string) => id !== conv_id);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
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
    }
    setIsDeleting(false);
  };
  return (
    <>
      {showMore && (
        <Modal
          title="Delete Chat"
          className="w-72 bg-zinc-950 border-zinc-700"
          subTitle="Are you sure?"
        >
          <p className="text-yellow-400">You cannot undo this action!</p>
          <div className="flex gap-2">
            <Button
              text="Delete"
              color1="bg-red-600"
              color2="bg-zinc-950"
              textColor1="text-white"
              onClick={handleDelete}
            />
            <Button text="Cancel" onClick={() => setShowMore(false)} />
          </div>
        </Modal>
      )}
      <div
        onClick={onClick}
        className={`p-4 relative hover:bg-zinc-900 z-0 transition-colors text-balance bg-zinc-900/50 backdrop-blur-sm overflow-clip border-[3px] h-32 w-[316.8px] border-zinc-700 rounded-lg ${
          isDeleting ? "pointer-events-none animate-bounce" : ""
        }`}
      >
        <img
          src="assets/dots.svg"
          className="absolute top-1 z-20 right-1 w-6 p-1 cursor-pointer"
          alt="more"
          onClick={(e) => {
            e.stopPropagation();
            setShowMore(!showMore);
          }}
        />
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="text-lg font-bold">{chartTitle}</h1>
            <p className="text-zinc-400 text-sm truncate max-w-[25ch]">
              {chartSubTitle}
            </p>
          </div>
          {fileName && (
            <p className="mt-1 text-zinc-400 truncate max-w-[12ch]">
              {fileName}
            </p>
          )}
        </div>
        <p className="mt-2 text-zinc-200 font-medium">
          <span className="text-zinc-400">You: </span>
          {firstMessage}
        </p>
      </div>
    </>
  );
}
