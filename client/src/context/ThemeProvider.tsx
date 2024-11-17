import { createContext, useState } from "react";

type User = {
  _id: string;
  username: string;
  email: string;
  // groq_api_key: string;
  convos: string[];
};

type ThemeContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <ThemeContext.Provider value={{ user, setUser }}>
      {children}
    </ThemeContext.Provider>
  );
}
