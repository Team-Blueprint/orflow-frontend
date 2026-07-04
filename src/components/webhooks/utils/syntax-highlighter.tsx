import { Highlight, themes } from "prism-react-renderer";
import { cn } from "@/lib/utils";

const codeTheme = {
  ...themes.nightOwl,
  plain: { ...themes.nightOwl.plain, backgroundColor: "transparent" },
};

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

export function SyntaxHighlighter({ code, language = "json", className }: SyntaxHighlighterProps) {
  return (
    <Highlight code={code} language={language} theme={codeTheme}>
      {({ className: hlClassName, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={cn("m-0 font-mono text-[11px] leading-relaxed", hlClassName, className)} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
