"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusIcon } from "lucide-react";
import { createReceipt, updateReceipt } from "../actions";
import { useRouter } from "next/navigation";
import ReceiptFormItemRow from "./receipt-form-item-row"; // <--- import the row component

export type ReceiptItem = {
  id?: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
};

type ReceiptFormProps = {
  receipt?: {
    id: string;
    storeName: string;
    storeAddress: string;
    date: string;
    category: string;
    items: ReceiptItem[];
  };
};

const initItem = {
  name: "",
  quantity: 1,
  unit: "piece",
  pricePerUnit: 0,
  discount: 0,
};

export default function ReceiptForm({ receipt }: ReceiptFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<ReceiptItem[]>(
    receipt?.items || [initItem]
  );
  const router = useRouter();

  const addItem = useCallback(() => {
    setItems((prevItems) => [...prevItems, initItem]);
  }, []);

  // Using useCallback prevents re-creating the function on every render.
  const updateItem = useCallback(
    (index: number, field: keyof ReceiptItem, value: string | number) => {
      setItems((prevItems) =>
        prevItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const removeItem = useCallback((index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  const calculateTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemTotal = item.quantity * item.pricePerUnit - item.discount;
      return total + itemTotal;
    }, 0);
  }, [items]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("items", JSON.stringify(items));
    setIsLoading(true);

    try {
      if (receipt) {
        await updateReceipt(formData);
        router.push(`/receipts/${receipt.id}`);
      } else {
        const newReceipt = await createReceipt(formData);
        router.push(`/receipts/${newReceipt.id}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {receipt && <input type="hidden" name="id" value={receipt.id} />}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="storeName">Store Name</Label>
          <Input
            autoFocus
            id="storeName"
            name="storeName"
            defaultValue={receipt?.storeName}
            required
          />
        </div>
        <div>
          <Label htmlFor="storeAddress">Store Address</Label>
          <Input
            id="storeAddress"
            name="storeAddress"
            defaultValue={receipt?.storeAddress}
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Purchase Date</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={
              receipt?.date
                ? new Date(receipt.date).toISOString().split("T")[0]
                : undefined
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Purchase Category</Label>
          <Select name="category" defaultValue={receipt?.category}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groceries">Groceries</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        {items.map((item, index) => (
          <ReceiptFormItemRow
            key={item.id || index}
            item={item}
            index={index}
            removeItem={removeItem}
            updateItem={updateItem}
          />
        ))}
        <Button type="button" onClick={addItem} className="mt-2">
          <PlusIcon className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-xl font-semibold">
          Total:{" "}
          {Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PLN",
          }).format(calculateTotal())}
        </div>
        <div className="space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Loading" : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
