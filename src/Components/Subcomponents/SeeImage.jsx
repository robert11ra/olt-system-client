import { useEffect, useState } from "react";

export default function SeeImage({ imageUrl, resolve }) {
  const [hide, setHide] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <>
      {imageUrl ? (
        <div            onClick={() => {
              setHide(true);
              resolve();
            }}
          className={
            (hide || !loaded ? "opacity-0" : "") +
            " transition-all bg-black/50 z-[1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000] fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center"
          }
        >
          <img
            onClick={() => {
              setHide(true);
              resolve();
            }}
            src={imageUrl}
            className="w-full h-full object-contain cursor-pointer bg-white"
          />
        </div>
      ) : null}
    </>
  );
}
