"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrashIcon } from "lucide-react";
import type { ReceiptItem } from "./receipt-form";

interface ReceiptFormItemRowProps {
  item: ReceiptItem;
  index: number;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof ReceiptItem,
    value: string | number
  ) => void;
}

function ReceiptFormItemRow({
  item,
  index,
  removeItem,
  updateItem,
}: ReceiptFormItemRowProps) {
  return (
    <div className="grid grid-cols-6 gap-2 mb-2">
      <Input
        autoFocus
        placeholder="Item name"
        value={item.name}
        onChange={(e) => updateItem(index, "name", e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Quantity"
        value={item.quantity}
        onChange={(e) =>
          updateItem(index, "quantity", parseFloat(e.target.value))
        }
        required
      />
      <Select
        value={item.unit}
        onValueChange={(value) => updateItem(index, "unit", value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="service">Service</SelectItem>
          <SelectItem value="piece">Piece</SelectItem>
          <SelectItem value="kg">Kg</SelectItem>
          <SelectItem value="liter">Liter</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        step="0.01"
        placeholder="Price per unit"
        value={item.pricePerUnit}
        onChange={(e) =>
          updateItem(index, "pricePerUnit", parseFloat(e.target.value))
        }
        required
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Discount"
        value={item.discount}
        onChange={(e) =>
          updateItem(index, "discount", parseFloat(e.target.value))
        }
      />
      <Button
        type="button"
        variant="destructive"
        onClick={() => removeItem(index)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default React.memo(ReceiptFormItemRow);
