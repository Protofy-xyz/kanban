import SyntaxHighlighter from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "highlight.js/styles/a11y-dark.min.css";
import { Check, Clipboard } from "lucide-react";
import useClipboard from "../../hooks/useClipboard";

type Props = {
  children: string;
  language: string;
};

export default function CodeHighlight({ children, language }: Props) {
  const { copy, copied } = useClipboard();
  return (
    <div className="mycode relative">
      <div className=" absolute right-0 m-2 z-10">
        {!copied ? (
          <button
            className="edit md:ml-8 text-white dark:text-teal-200 text-xl"
            onClick={() => copy(children)}
          >
            <Clipboard />
          </button>
        ) : (
          <span className="dark:text-teal-200 text-white text-xl">
            <Check />
          </span>
        )}
      </div>

      <SyntaxHighlighter
        PreTag="div"
        children={children}
        language={language}
        style={dracula}
        className=" border-2 dark:border-teal-500 relative"
      />
    </div>
  );
}
