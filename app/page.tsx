import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { getReceipts, deleteReceipt } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const receipts = await getReceipts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Receipts</h1>
        <Link href="/receipts/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Receipt
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Store Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipts.map((receipt) => (
            <TableRow key={receipt.id}>
              <TableCell>{receipt.storeName}</TableCell>
              <TableCell>{receipt.category}</TableCell>
              <TableCell>
                {new Date(receipt.date).toLocaleDateString()}
              </TableCell>
              <TableCell>${receipt.totalAmount?.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/receipts/${receipt.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                  <Link href={`/receipts/${receipt.id}/edit`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <form action={deleteReceipt}>
                    <input type="hidden" name="id" value={receipt.id} />
                    <Button variant="destructive" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
