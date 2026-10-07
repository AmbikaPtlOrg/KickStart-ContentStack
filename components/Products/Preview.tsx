"use client";

import { useCallback, useEffect, useState } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import { getProductsByEfficiency, initLivePreview } from "@/lib/contentstack";
import type { ProductsListing } from "@/lib/types";
import ProductListing from "./page";

type Efficiency = "all" | "high" | "medium" | "low";

export default function ProductPreview({
	products: initialProducts,
	selectedEfficiency,
}: {
	products: ProductsListing[];
	selectedEfficiency: Efficiency;
}) {
	const [products, setProducts] = useState(initialProducts);

	const refreshProducts = useCallback(async () => {
		const updatedProducts = await getProductsByEfficiency(selectedEfficiency);
		setProducts(updatedProducts);
	}, [selectedEfficiency]);

	useEffect(() => {
		setProducts(initialProducts);
	}, [initialProducts]);

	useEffect(() => {
		initLivePreview();
		const uid = ContentstackLivePreview.onEntryChange(refreshProducts, {
			skipInitialRender: true,
		});

		return () => {
			ContentstackLivePreview.unsubscribeOnEntryChange(uid);
		};
	}, [refreshProducts]);

	return (
		<ProductListing
			products={products}
			selectedEfficiency={selectedEfficiency}
		/>
	);
}
