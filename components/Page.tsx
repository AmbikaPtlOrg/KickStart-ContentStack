// Importing DOMPurify for sanitizing HTML content to prevent XSS attacks
import DOMPurify from "isomorphic-dompurify";
// Importing Next.js optimized Image component for better performance
import Image from "next/image";
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
          const products = section.product_carousel?.products ?? [];

          return (
            <section
              key={
                section.product_carousel?._metadata?.uid ||
                section._metadata?.uid ||
                `product-carousel-${sectionIndex}`
              }
              className="space-y-4"
              aria-label="Featured products"
            >
              <h2 className="text-2xl font-bold">Featured products</h2>
              {products.length > 0 ? (
                <div className="featured-products__grid grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3">
                  {products.map((product) => (
                    <article
                      key={product.uid || product.title}
                      className="product-card min-w-0"
                    >
                      {(() => {
                        const image = Array.isArray(product.product_image)
                          ? product.product_image.find((asset) => asset.url?.trim())
                          : product.product_image;
                        const imageUrl = image?.url?.trim();

                        return imageUrl ? (
                        <div className="product-card__image">
                          <Image
                            src={imageUrl}
                            alt={image?.title || product.title}
                            width={640}
                            height={480}
                            unoptimized
                            className="aspect-[4/3] w-full object-cover"
                          />
                        </div>
                        ) : null;
                      })()}
                      <div className="space-y-2 p-4">
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
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No products selected.</p>
              )}
            </section>
          );
        })}

        {/* Map through blocks array to render each modular content block */}
        {page?.blocks?.map((item, index) => {
          const { block } = item; // Extract block data from item
          const isImageLeft = block.layout === "image_left"; // Determine layout direction
         
          return (
            <div
              key={block._metadata?.uid || `block-${index}`} // Use unique identifier as key for React
              {...(page?.$ && page?.$[`blocks__${index}`])} // Live preview attributes for each block
              className={`content-block flex flex-col md:flex-row items-center space-y-4 md:space-y-0 ${
                isImageLeft ? "md:flex-row" : "md:flex-row-reverse" // Conditional layout based on block settings
              }`}
            >
              {/* Image container - takes half width on medium screens and up */}
              <div className="content-block__image w-full md:w-1/2">
                {block.image ? (
                  <Image
                    key={`image-${block._metadata?.uid || index}`} // Unique key for image
                    src={block.image.url}
                    alt={block.image.title}
                    width={200}
                    height={112}
                    className="w-full"
                    {...(block?.$ && block?.$.image)} // Live preview attributes for image
                  />
                ) : null}
              </div>

              {/* Content container - takes half width on medium screens and up */}
              <div className="content-block__copy w-full md:w-1/2">
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
