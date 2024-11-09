import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";

/*
En esta pagina => https://randomfox.ca
el limite es de 124
*/
type LazyImageProps = { 
    src: string;
    onLazyLoad?: (node: HTMLImageElement) => void;
};

type ImageNative = ImgHTMLAttributes<HTMLImageElement>;

type Props = LazyImageProps & ImageNative;
/*
interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}
*/
export const LazyImage = ({ src, onLazyLoad, ...imageProps }: Props): JSX.Element => {
    const node = useRef<HTMLImageElement>(null);
    const [isLazyLoaded, setIsLazyLoaded] = useState<boolean>(false);
    const [currentSrc, setCurrentSrc] = useState<string>(
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4="
    );
    useEffect(() => {
        if (isLazyLoaded) return;

        let options = { threshold: 1.0 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || !node.current) return;
                console.log(entry.isIntersecting);
                console.log(node.current);
                setCurrentSrc(src);
                observer.disconnect();
                setIsLazyLoaded(true);
                if (typeof onLazyLoad === "function") {
                    onLazyLoad(node.current);
                }
                window.plausible("lazyload", { props: { src } });
            });
        }, options);
        if (node.current) {
            observer.observe(node.current);
        }
        return () => { observer.disconnect() };
    }, [currentSrc]);
    return (
        <img 
            ref={node}
            src={currentSrc}
            {...imageProps}
        />
    );
};
