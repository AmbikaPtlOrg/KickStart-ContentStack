import ProductListing from "@/components/Products/page";
import ProductPreview from "@/components/Products/Preview";
import { getProductsByEfficiency, isPreview } from "@/lib/contentstack";

const efficiencies = ["all", "high", "medium", "low"] as const;
type Efficiency = (typeof efficiencies)[number];

export default async function ProductPage({
	searchParams,
}: {
	searchParams: Promise<{ efficiency?: string }>;
}) {
	const { efficiency: requestedEfficiency } = await searchParams;
	const efficiency: Efficiency = efficiencies.includes(
		requestedEfficiency as Efficiency,
	)
		? (requestedEfficiency as Efficiency)
		: "all";
	const products = await getProductsByEfficiency(efficiency);

	return isPreview ? (
		<ProductPreview products={products} selectedEfficiency={efficiency} />
	) : (
		<ProductListing products={products} selectedEfficiency={efficiency} />
	);
}