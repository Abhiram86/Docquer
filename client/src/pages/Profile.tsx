import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { update } from "../api/auth";
import ProfileBento from "../components/ProfileBento";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  const context = useContext(ThemeContext);
  const router = useNavigate();
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { user, setUser } = context;
  useEffect(() => {
    if (!user) {
      router("/auth?mode=login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [showModal, setShowModal] = useState(false);
  const inputRefs = useRef<HTMLInputElement[] | null[]>([]);
  const fields = [
    {
      label: "Username",
      value: user?.username,
      type: "text",
    },
    {
      label: "Email",
      value: user?.email,
      type: "email",
    },
    {
      label: "Groq_API_Key",
      value: "",
      type: "password",
    },
  ];
  const handleSave = async () => {
    const updatedFields: Record<string, string> = {};
    inputRefs.current.forEach((ref, index) => {
      if (ref) {
        updatedFields[fields[index].label.toLowerCase()] = ref.value;
      }
    });
    const res = await update({ ...updatedFields, id: user?._id } as {
      id: string;
      username: string;
      email: string;
      groq_api_key: string;
    });
    if (res.status === 200) {
      setShowModal(false);
      toast.success("Successfully updated", {
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
    }
  };
  const Logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router("/auth?mode=login");
  };
  return (
    <section className="px-4 py-2">
      {showModal && (
        <Modal
          title="Your Profile"
          subTitle="Edit your profile"
          className="w-72 border-zinc-600 bg-zinc-950"
        >
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={index} className="space-y-1">
                <p>{field.label}</p>
                <input
                  className="bg-black border-2 border-zinc-700 rounded-md px-4 py-[0.375rem] w-full"
                  ref={(el) => (inputRefs.current[index] = el)}
                  name={field.label}
                  placeholder={field.value}
                  defaultValue={field.value}
                  type={field.type}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              text="Cancel"
              color1="bg-red-500"
              color2="bg-zinc-950"
              textColor1="text-white"
              onClick={() => setShowModal(false)}
            />
            <Button text="Save" onClick={handleSave} />
          </div>
        </Modal>
      )}
      <div className="flex justify-between items-center">
        <div className="flex flex-row items-center gap-4">
          <h1 className="text-3xl font-semibold">
            Hello <strong className="text-purple-400">{user?.username}</strong>
          </h1>
          <p
            className="px-2 hover:bg-transparent mt-1 transition-colors cursor-pointer bg-zinc-800 rounded-3xl"
            onClick={() => setShowModal(true)}
          >
            edit
          </p>
        </div>
        <button
          className="bg-red-700 px-3 hover:bg-transparent mt-1 transition-colors cursor-pointer rounded-3xl"
          onClick={Logout}
        >
          Logout
        </button>
      </div>
      <ProfileBento />
      <Toaster />
    </section>
  );
}
