import ReceiptForm from "@/app/components/receipt-form";
import { getReceipt } from "@/app/actions";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditReceiptPage({ params }: PageProps) {
  const { id } = await params;
  let receipt;
  try {
    receipt = await getReceipt(id);
  } catch (error) {
    notFound();
  }

  if (!receipt) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Receipt</h1>
      <ReceiptForm receipt={receipt} />
    </div>
  );
}
