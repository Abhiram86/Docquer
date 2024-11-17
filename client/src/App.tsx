import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { Sidebar, Header } from "./components/Sidebar";
import { useContext, useEffect, useState } from "react";
import About from "./pages/About";
import Chats from "./pages/Chats";
import { ThemeContext } from "./context/ThemeProvider";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";

export default function App() {
  const [open, setOpen] = useState(false);
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }
  const { user, setUser } = context;
  useEffect(() => {
    if (!user) {
      const data = localStorage.getItem("user");
      if (data) {
        setUser(JSON.parse(data));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <main className="main w-full min-h-[100svh] max-w-[1000px] z-0 border-zinc-400 mx-auto flex flex-col">
      <Navbar />
      <Header open={open} setOpen={setOpen} />
      <Sidebar open={open} setOpen={setOpen} />
      <div className="flex-1" onClick={() => setOpen(false)}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </main>
  );
}
