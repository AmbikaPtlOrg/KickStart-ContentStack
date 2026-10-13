"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { ProductsListing } from "../lib/types";

interface FeaturedProductsCarouselProps {
  products: ProductsListing[];
}

export default function FeaturedProductsCarousel({
  products,
}: FeaturedProductsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateScrollButtons = () => {
      setCanScrollPrevious(track.scrollLeft > 0);
      setCanScrollNext(
        track.scrollLeft + track.clientWidth < track.scrollWidth - 1,
      );
    };

    updateScrollButtons();
    track.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      track.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [products.length]);

  const scroll = (direction: "previous" | "next") => {
    const track = trackRef.current;
    const firstSlide = track?.firstElementChild;
    if (!track || !(firstSlide instanceof HTMLElement)) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const distance = (firstSlide.getBoundingClientRect().width + gap) * 2;
    track.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="featured-products space-y-4"
      aria-label="Featured products"
    >
      <div className="featured-products__header">
        <h2 className="text-2xl font-bold">Featured products</h2>
        {products.length > 1 ? (
          <div
            className="featured-products__controls"
            role="group"
            aria-label="Carousel controls"
          >
            <button
              type="button"
              className="featured-products__control"
              aria-label="Show previous products"
              aria-controls={trackId}
              disabled={!canScrollPrevious}
              onClick={() => scroll("previous")}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className="featured-products__control"
              aria-label="Show next products"
              aria-controls={trackId}
              disabled={!canScrollNext}
              onClick={() => scroll("next")}
            >
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        ) : null}
      </div>

      {products.length > 0 ? (
        <div
          ref={trackRef}
          id={trackId}
          className="featured-products__track"
          role="region"
          aria-label="Featured products carousel"
          tabIndex={0}
        >
          {products.map((product) => {
            const image = Array.isArray(product.product_image)
              ? product.product_image.find((asset) => asset.url?.trim())
              : product.product_image;
            const imageUrl = image?.url?.trim();

            return (
              <div
                key={product.uid || product.title}
                className="container max-w-sm md:max-w-xl lg:max-w-2xl product-card featured-products__slide"
              >
                {imageUrl ? (
                  <div className="product-card__image">
                    <Image
                      src={imageUrl}
                      alt={image?.title || product.title}
                      width={640}
                      height={480}
                      unoptimized
                      className="aspect-[4/3] w-full object-contain"
                    />
                  </div>
                ) : null}
                <div className="pd_details space-y-2 p-4">
                  <h3 className="text-lg font-semibold">{product.title}</h3>
                  {typeof product.price === "number" ? (
                    <p className="font-medium">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(product.price)}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No products selected.</p>
      )}
    </section>
  );
}
