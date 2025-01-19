import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getReceipt, deleteReceipt } from "@/app/actions";
import { notFound } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReceiptPage({ params }: PageProps) {
  let receipt;
  try {
    const { id } = await params;
    receipt = await getReceipt(id);
  } catch (error) {
    notFound();
  }

  if (!receipt) {
    notFound();
  }

  console.log(receipt);

  return (
    <div className="container mx-auto py-10 w-full">
      <h1 className="text-3xl font-bold mb-6">Receipt Details</h1>
      <div className=" shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold">Store Name</h2>
            <p>{receipt.storeName}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Store Address</h2>
            <p>{receipt.storeAddress}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Purchase Date</h2>
            <p>{new Date(receipt.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Category</h2>
            <p>{receipt.category}</p>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Price per Unit</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {receipt.items.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>${item.pricePerUnit.toFixed(2)}</TableCell>
                <TableCell>${item.discount.toFixed(2)}</TableCell>
                <TableCell>
                  $
                  {(
                    item.quantity * item.pricePerUnit -
                    item.quantity * item.discount
                  ).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-between items-center space-y-2">
          <div className="text-xl font-semibold">
            Total: ${receipt.totalAmount.toFixed(2)}
          </div>
          <div className="flex space-x-2">
            <Link href={`/receipts/${receipt.id}/edit`}>
              <Button>Edit</Button>
            </Link>
            <form action={deleteReceipt}>
              <input type="hidden" name="id" value={receipt.id} />
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
