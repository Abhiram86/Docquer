import { useLocation, useNavigate } from "react-router-dom";
import { Form, Input } from "../components/Form";
import { useContext, useRef } from "react";
import { login, register } from "../api/auth";
import { ThemeContext } from "../context/ThemeProvider";
import { auth, provider } from "../../firebase";
import { signInWithPopup } from "firebase/auth";
// import jwtDecode from "jwt-decode";
import toast from "react-hot-toast";

export interface FormData {
  username: string;
  email?: string;
  password: string | null;
  GoogleRegister: boolean;
}

export default function Auth() {
  const router = useNavigate();
  const location = useLocation();

  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("ThemeContext not found");
  }

  const { user, setUser } = context;

  const getQueryParams = (search: string) => {
    return new URLSearchParams(search);
  };

  const queryParams = getQueryParams(location.search);
  const mode = queryParams.get("mode");

  const handleLogin = async () => {
    if (usernameRef.current?.value && passwordRef.current?.value) {
      const res = await login({
        email: usernameRef.current.value,
        username: null,
        password: passwordRef.current.value,
        GoogleLogin: false,
      });
      if (res.status === 200 && res.data.data) {
        setUser(res.data.data);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        toast.success(`Successfully logged in as ${res.data.data.username}`, {
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
        });
        router("/chat/new");
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
    }
  };
  const handleRegister = async () => {
    if (
      usernameRef.current?.value &&
      emailRef.current?.value &&
      passwordRef.current?.value
    ) {
      const res = await register({
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        GoogleRegister: false,
      });
      if (res.status === 200) {
        router("/auth?mode=login");
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
    }
  };

  const handleGoogleAuthRegister = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      if (user && user.email) {
        const res = await register({
          username: user.displayName || user.email.split("@")[0],
          email: user.email,
          password: null,
          GoogleRegister: true,
        });
        if (res.status === 200) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          setUser(res.data.data);
          toast.success(
            `Successfully registered as ${res.data.data.username}`,
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
          router("/chat/new");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleAuthLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const user = res.user;
      if (user && user.email) {
        const res = await login({
          email: user.email,
          username: user.displayName || user.email.split("@")[0],
          password: null,
          GoogleLogin: true,
        });
        if (res.status === 200 && res.data.data) {
          setUser(res.data.data);
          localStorage.setItem("user", JSON.stringify(res.data.data));
          toast.success(`Successfully logged in as ${res.data.data.username}`, {
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
          });
          router("/chat/new");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  if (user) {
    router("/");
  }

  return (
    <section>
      <div className="w-fit mx-auto sm:mt-20 mt-12">
        <Form
          onGoogleAuth={
            mode === "login" ? handleGoogleAuthLogin : handleGoogleAuthRegister
          }
          onSubmit={mode === "login" ? handleLogin : handleRegister}
          formButtonName={mode === "login" ? "Login" : "Create my account"}
          formTitle={
            mode === "login" ? "Login to your account" : "Create Your Account"
          }
          FormSubTitle="Enter your username and password"
          FormImageView={mode === "login" ? "Right" : "Left"}
        >
          <div className="flex flex-col">
            {/* <Label
              htmlFor="username"
              text={mode === "login" ? "Username/Email" : "Username"}
              className="mb-1"
            /> */}
            <Input
              inputRef={usernameRef}
              placeholder="username or email..."
              name="username"
            />
          </div>
          {mode !== "login" && (
            <div className="flex flex-col">
              {/* <Label htmlFor="email" text="Email" className="mb-1" /> */}
              <Input
                inputRef={emailRef}
                placeholder="email..."
                InputType="email"
                name="email"
              />
            </div>
          )}
          <div className="flex flex-col mb-3">
            {/* <Label htmlFor="password" text="Password" className="mb-1" /> */}
            <Input
              inputRef={passwordRef}
              InputType="password"
              placeholder="password..."
              name="password"
            />
          </div>
        </Form>
      </div>
      {mode !== "login" ? (
        <p className="text-center mt-4 select-none">
          Already have an account?{" "}
          <span
            className="text-blue-800 underline underline-offset-2 cursor-pointer"
            onClick={() => router("/auth?mode=login")}
          >
            Login
          </span>
        </p>
      ) : (
        <p className="text-center mt-4 select-none">
          Dont have an account?{" "}
          <span
            className="text-blue-800 underline underline-offset-2 cursor-pointer"
            onClick={() => router("/auth?mode=register")}
          >
            Register
          </span>
        </p>
      )}
      {/* <Toaster
      // containerStyle={{
      //   backgroundColor: "rgb(63 63 70)",
      //   color: "white",
      // }}
      /> */}
    </section>
  );
}
