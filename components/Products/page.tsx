import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import type { ProductsListing as ProductListingEntry } from "@/lib/types";

export default function ProductListing({
	products,
	selectedEfficiency,
}: {
	products: ProductListingEntry[];
	selectedEfficiency: "all" | "high" | "medium" | "low";
}) {
	// const authorNames = product.author_ref?.map((author) =>
	// 	typeof author === "string" ? author : author.name || author.title || author.uid,
	// );

	return (
		<main className="product-listing space-y-8">
			<h1 className="text-3xl font-bold">Products</h1>
			<form method="get" className="product-filter flex items-center gap-3">
				<label htmlFor="efficiency" className="font-medium">Efficiency</label>
				<select
					id="efficiency"
					name="efficiency"
					defaultValue={selectedEfficiency}
					className="product-filter__select rounded border border-gray-300 bg-white px-3 py-2"
				>
					<option value="all">All</option>
					<option value="high">High</option>
					<option value="medium">Medium</option>
					<option value="low">Low</option>
				</select>
				<button type="submit" className="product-filter__button rounded bg-black px-4 py-2 text-white">
					Filter
				</button>
			</form>
			{products.length === 0 ? (
				<p>No products found.</p>
			) : (
			<section className="product-grid grid gap-8 sm:grid-cols-2 lg:grid-cols-3" aria-label="Products">
				{products.map((product) => (
					<article key={product.uid} className="product-card space-y-4 p-3">
				{(() => {
					const image = Array.isArray(product.product_image)
						? product.product_image.find((asset) => asset.url?.trim())
						: product.product_image;
					const imageUrl = image?.url?.trim();

					return imageUrl ? (
					<div className="product-card__image">
						<Image
							src={imageUrl}
							alt={image.title || product.title}
							width={720}
							height={540}
							unoptimized
							className="w-full"
						/>
					</div>
					) : null;
				})()}

				
				<div className="space-y-4">
					<p className="text-sm font-medium uppercase text-gray-600">
						{product.title}
					</p>
					<h2 className="text-2xl font-bold">{product.title}</h2>
					<p className="text-2xl font-semibold">
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD",
						}).format(product.price)}
					</p>
					{product.description ? (
						<div
							className="prose"
							dangerouslySetInnerHTML={{
								__html: DOMPurify.sanitize(product.description),
							}}
						/>
					) : null}
					{/* {authorNames?.length ? (
						<p className="text-sm text-gray-600">Author: {authorNames.join(", ")}</p>
					) : null} */}
				</div>
					</article>
				))}
			</section>
			)}

			
		</main>
	);
}
