import { MutableRefObject } from "react";
import Button from "./Button";

export function Form({
  children,
  onSubmit,
  onGoogleAuth,
  className,
  formButtonName,
  formTitle,
  FormSubTitle,
  FormImageView,
}: {
  children: React.ReactNode;
  onSubmit: () => void;
  onGoogleAuth: () => void;
  className?: string;
  formButtonName: string;
  formTitle: string;
  FormSubTitle: string;
  FormImageView?: "Left" | "Right";
}) {
  return (
    <div
      className={`flex ${
        FormImageView === "Left" ? "flex-row" : "flex-row-reverse"
      } border-2 w-fit p-4 gap-4 transition-all select-none border-zinc-700 rounded-lg ${className}`}
    >
      <img
        src="assets/earth.jpg"
        alt="earth"
        className="auth-img object-cover w-64 rounded-xl"
      />
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold">{formTitle}</h1>
          <h2 className="text-zinc-500">{FormSubTitle}</h2>
        </div>
        <form className="flex flex-col gap-2">
          {children}
          <div className="space-y-2">
            <div className="w-full">
              <Button text={formButtonName} onClick={onSubmit} />
            </div>
            <div className="flex flex-row items-center gap-2">
              <hr className="border-zinc-500 flex-1" />
              <p>or</p>
              <hr className="border-zinc-500 flex-1" />
            </div>
            <div>
              <Button
                text={
                  FormImageView === "Left"
                    ? "Sign up with Google"
                    : "Sign in with Google"
                }
                color1="bg-zinc-800"
                textColor1="text-white"
                onClick={onGoogleAuth}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Input({
  className,
  name,
  placeholder,
  InputType = "text",
  inputRef,
  defaultValue,
}: {
  name: string;
  className?: string;
  placeholder?: string;
  InputType?: "text" | "email" | "password" | "number" | "url";
  inputRef: MutableRefObject<HTMLInputElement | null>;
  defaultValue?: string;
}) {
  return (
    <div>
      <input
        className={`bg-black border-2 border-zinc-700 rounded-lg px-4 py-[0.375rem] w-full ${className}`}
        type={InputType}
        name={name}
        id={name}
        ref={inputRef}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={InputType === "password" ? "current-password" : "on"}
      />
    </div>
  );
}

export function Label({
  className,
  text,
  htmlFor,
}: {
  text: string;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {text}
    </label>
  );
}
