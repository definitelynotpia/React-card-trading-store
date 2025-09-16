import { renderToStaticMarkup } from "react-dom/server";
import parse, { domToReact } from "html-react-parser";

// inject custom gradient into icon svg
function convertToLinearGradient(str) {
  const gradientDef = `
    <defs>
      <linearGradient id="myGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#235D64" />
        <stop offset="100%" stop-color="#70B8C1" />
      </linearGradient>
    </defs>
    <g fill="url(#myGradient)" stroke="url(#myGradient)">
  `;

  const firstClose = str.indexOf(">");
  const newStr =
    str.slice(0, firstClose + 1) + gradientDef + str.slice(firstClose + 1);
  const lastOpen = newStr.lastIndexOf("<");
  const finalStr = newStr.slice(0, lastOpen) + "</g></svg>";

  // fill all icon paths
  return finalStr
    .replace(/fill="none"/g, "")
    .replace(/stroke="currentColor"/g, 'stroke="url(#myGradient)"')
    .replace(/fill="currentColor"/g, 'fill="url(#myGradient)"')
    .replace(/stroke="[^"]*"/g, 'stroke="url(#myGradient)"');
}

// Render chosen icon as raw SVG string
export default function GradientIcon({ Icon, size = 64, onClick }) {
  const rawSvg = renderToStaticMarkup(<Icon size={size} />);
  const gradientSvg = convertToLinearGradient(rawSvg);

  return parse(gradientSvg, {
    replace: (domNode) => {
      if (domNode.name === "svg") {
        return (
          <svg
            {...domNode.attribs}
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : undefined }}
          >
            {domToReact(domNode.children)}
          </svg>
        );
      }
    },
  });
}
