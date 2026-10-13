// Importing DOMPurify for sanitizing HTML content to prevent XSS attacks
import DOMPurify from "isomorphic-dompurify";
// Importing Next.js optimized Image component for better performance
import Image from "next/image";
import FeaturedProductsCarousel from "./FeaturedProductsCarousel";
// Importing the Page type definition from our types file
import { Page } from "../lib/types";
// Importing Visual Builder class for empty block handling in Contentstack Live Preview
import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";

// Interface defining the props for the ContentDisplay component
interface ContentDisplayProps {
  page: Page | undefined; // Page data that may be undefined during loading
}

// Main component for displaying page content with Contentstack Live Preview support
export default function ContentDisplay({ page }: ContentDisplayProps) {
  return (
    <section className="content-page">
      {/* Display page title if it exists */}
      {page?.title ? (
        <h1
          className="text-4xl font-bold mb-4 text-center"
          // Spread live preview attributes for editing capability in Contentstack
          {...(page?.$ && page?.$.title)}
        >
          {page?.title}
        </h1>
      ) : null}

      {/* Display page description if it exists */}
      {page?.description ? (
        <p className="mb-4 text-center" {...(page?.$ && page?.$.description)}>
          {page?.description}
        </p>
      ) : null}

      {/* Display hero image if it exists */}
      {page?.image ? (
        <div className="image-frame hero-image-frame">
        
          <Image
            width={768}
            height={414}
            src={page.image?.url}
            alt={page.image?.title}
            {...(page?.image?.$ && page?.image?.$.url)}
          />
        </div>
      ) : null}

      {/* Display rich text content if it exists, sanitized for security */}
      {page?.rich_text ? (
        <div
          {...(page?.$ && page?.$.rich_text)}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(page?.rich_text), // Sanitize HTML to prevent XSS attacks
          }}
        />
      ) : null}

      {/* 
        Container for modular blocks with Visual Builder support
        Adds empty block class when no blocks exist for better editing experience
      */}
      <div
        className={`space-y-8 max-w-full mt-4 ${
          (!page?.blocks || page.blocks.length === 0) &&
          (!page?.page_sections_modularblocks ||
            page.page_sections_modularblocks.length === 0)
            ? VB_EmptyBlockParentClass // Special class for empty state in Visual Builder
            : ""
        }`}
        {...(page?.$ && page?.$.blocks)}
      >
        {page?.page_sections_modularblocks?.map((section, sectionIndex) => {
          if (section.product_carousel) {
            return (
              <FeaturedProductsCarousel
                key={
                  section.product_carousel._metadata?.uid ||
                  section._metadata?.uid ||
                  `product-carousel-${sectionIndex}`
                }
                products={section.product_carousel.products ?? []}
              />
            );
          }

          if (section.hero_banner) {
            const heroBanner = section.hero_banner;
            const bannerUrl =
              typeof heroBanner.url === "string"
                ? heroBanner.url
                : heroBanner.url?.href;

            return (
              <section
                key={
                  heroBanner._metadata?.uid ||
                  section._metadata?.uid ||
                  `hero-banner-${sectionIndex}`
                }
                className="hero-banner"
                aria-label={heroBanner.title || "Featured"}
              >
                {heroBanner.image?.url ? (
                  <div className="hero-banner__image">
                    <Image
                      src={heroBanner.image.url}
                      alt={heroBanner.image.title || heroBanner.title || ""}
                      width={heroBanner.image.dimension?.width || 1200}
                      height={heroBanner.image.dimension?.height || 800}
                      className="w-full"
                      {...(heroBanner.$?.image && {
                        ...heroBanner.$.image,
                      })}
                    />
                  </div>
                ) : null}

                <div className="hero-banner__content">
                  {heroBanner.title ? (
                    <h2
                      className="text-3xl font-bold"
                      {...(heroBanner.$?.title && {
                        ...heroBanner.$.title,
                      })}
                    >
                      {heroBanner.title}
                    </h2>
                  ) : null}
                  {heroBanner.description ? (
                    <p
                      className="hero-banner__description"
                      {...(heroBanner.$?.description && {
                        ...heroBanner.$.description,
                      })}
                    >
                      {heroBanner.description}
                    </p>
                  ) : null}
                  {bannerUrl ? (
                    <a
                      className="hero-banner__link"
                      href={bannerUrl}
                      {...(heroBanner.$?.url && {
                        ...heroBanner.$.url,
                      })}
                    >
                      {typeof heroBanner.url === "object" &&
                      heroBanner.url?.title
                        ? heroBanner.url.title
                        : "Learn more"}
                    </a>
                  ) : null}
                </div>
              </section>
            );
          }

          return null;
        })}

        {/* Map through blocks array to render each modular content block */}
        {page?.blocks?.map((item, index) => {
          const { block } = item; // Extract block data from item
         
          return (
            <div
              key={block._metadata?.uid || `block-${index}`} // Use unique identifier as key for React
              {...(page?.$ && page?.$[`blocks__${index}`])} // Live preview attributes for each block
              className="content-block flex flex-col"
            >
              <div className="content-block__image">
                {block.image ? (
                  <Image
                    key={`image-${block._metadata?.uid || index}`} // Unique key for image
                    src={block.image.url}
                    alt={block.image.title}
                    width={block.image.dimension?.width || 1920}
                    height={block.image.dimension?.height || 800}
                    className="w-full"
                    {...(block?.$ && block?.$.image)} // Live preview attributes for image
                  />
                ) : null}
              </div>

              <div className="content-block__copy w-full">
                {/* Block title */}
                {block.title ? (
                  <h2
                    className="text-2xl font-bold"
                    {...(block?.$ && block?.$.title)} // Live preview attributes for title
                  >
                    {block.title}
                  </h2>
                ) : null}

                {/* Block rich text content, sanitized for security */}
                {block.copy ? (
                  <div
                    {...(block?.$ && block?.$.copy)} // Live preview attributes for copy
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(block.copy), // Sanitize HTML content
                    }}
                    className="prose" // Apply prose styling for better typography
                  />
                ) : null}

               
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
