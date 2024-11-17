import { useEffect, useState } from "react";

export default function WritingText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (isTyping) {
          if (index < text.length) {
            setDisplayText((prev) => prev + text[index]);
            setIndex((prev) => prev + 1);
          } else {
            setIsTyping(false);
          }
        } else {
          if (index > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
            setIndex((prev) => prev - 1);
          } else {
            setIsTyping(true);
          }
        }
      },
      isTyping ? Math.floor(Math.random() * 26) + 100 : 50
    );

    return () => clearTimeout(timeout);
  }, [text, index, isTyping]);

  return (
    <p className={className}>
      {displayText}
      <span className="font-thin relative bottom-[2px] cursor">|</span>
    </p>
  );
}
