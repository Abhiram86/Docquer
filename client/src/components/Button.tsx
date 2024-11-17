export default function Button({
  onClick,
  text,
  color1 = "bg-zinc-100",
  textColor1 = "text-zinc-900",
  color2 = "bg-purple-700",
  className,
  width = "w-full", // Add a width prop for customization
}: {
  onClick: () => void;
  text: string;
  color1?: string;
  color2?: string;
  textColor1?: string;
  className?: string;
  width?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative transition-all active:scale-95 px-6 py-2 font-semibold ${textColor1} ${color1} ${className} rounded-md overflow-hidden ${width} group`}
    >
      <span
        className={`absolute inset-0 transition-transform duration-300 ${color2} transform translate-y-full group-hover:translate-y-0`}
      ></span>
      <span
        className={`relative z-10 transition-colors duration-300 group-hover:text-white font-semibold`}
      >
        {text}
      </span>
    </button>
  );
}
