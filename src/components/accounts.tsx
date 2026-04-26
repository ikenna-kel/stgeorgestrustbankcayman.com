"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
  slides: React.ReactNode[];
};

export default function Carousel({ slides }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="w-full">
      {/* Viewport */}
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        {/* Container */}
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%] p-2"
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <button
          onClick={scrollPrev}
          className="rounded-xl border px-4 py-2 text-sm"
        >
          Prev
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 w-2 rounded-full ${
                index === selectedIndex ? "bg-black" : "bg-black/20"
              }`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="rounded-xl border px-4 py-2 text-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}
