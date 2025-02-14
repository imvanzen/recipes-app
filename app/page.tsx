import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EyeIcon, Pen, PlusIcon, Trash } from "lucide-react";
import Link from "next/link";
import { getReceipts, deleteReceipt } from "./actions";
import { formatMoney } from "@/utils/format-money";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const receipts = await getReceipts();

  return (
    <div className="container mx-auto">
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
              <TableCell>
                <b>{receipt.storeName}</b>
              </TableCell>
              <TableCell>{receipt.category}</TableCell>
              <TableCell>
                {new Date(receipt.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{formatMoney(receipt.totalAmount)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/receipts/${receipt.id}`}>
                    <Button variant="outline" size="sm">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/receipts/${receipt.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pen className="h-4 w-4" />
                    </Button>
                  </Link>
                  <form action={deleteReceipt}>
                    <input type="hidden" name="id" value={receipt.id} />
                    <Button variant="destructive" size="sm" type="submit">
                      <Trash className="h-4 w-4" />
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
