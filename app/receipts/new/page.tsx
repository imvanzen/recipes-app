import ReceiptForm from "@/app/components/receipt-form";

export default function NewReceiptPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Receipt</h1>
      <ReceiptForm />
    </div>
  );
}
