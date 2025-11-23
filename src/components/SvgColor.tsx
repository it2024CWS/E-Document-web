import { useRef } from 'react';
import SVG from 'react-inlinesvg';

interface Props {
  src: string;
}
function SvgColor({ src }: Props) {
  const svgRef = useRef<SVGElement>(null);

  const handleSVGLoad = () => {
    if (svgRef?.current) {
      const svgChildren = svgRef.current.children;
      for (let i = 0; i < svgChildren.length; i++) {
        svgChildren.item(i)?.setAttribute('stroke', 'currentColor');
        svgChildren.item(i)?.setAttribute('fill', 'currentColor');
      }
    }
  };

  return <SVG src={src} innerRef={svgRef} onLoad={handleSVGLoad} />;
}

export default SvgColor;
