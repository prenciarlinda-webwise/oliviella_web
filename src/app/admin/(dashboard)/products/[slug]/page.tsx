import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getExperience } from "@/lib/products-data";
import ProductEditForm from "@/components/admin/ProductEditForm";

export const metadata: Metadata = {
  title: "Edit product",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const experience = await getExperience(slug);
  if (!experience) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm font-medium text-olive hover:text-olive-deep">
        ← All products
      </Link>
      <h1 className="mt-3 font-display text-3xl text-olive-deep">{experience.name}</h1>

      <div className="mt-8">
        <ProductEditForm experience={experience} />
      </div>
    </div>
  );
}
