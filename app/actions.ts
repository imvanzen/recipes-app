"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { calculateTotal } from "@/utils/calculate-total";

export type ReceiptItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
};

type Receipt = {
  id: string;
  storeName: string;
  storeAddress: string;
  date: string;
  category: string;
  totalAmount: number;
  items: ReceiptItem[];
};

export async function getReceipts() {
  try {
    const supabase = await createClient();
    const { data: receips } = await supabase
      .from("receipts")
      .select("*,receipt_items(*)");

    if (!receips) {
      throw new Error("Failed to fetch receipts. Please try again later.");
    }

    return receips.map((receipt: any) => ({
      id: receipt.id,
      storeName: receipt.store_name,
      storeAddress: receipt.store_address,
      date: receipt.date,
      category: receipt.category,
      totalAmount: calculateTotal(
        receipt.receipt_items.map((item: any) => ({
          quantity: item.quantity,
          pricePerUnit: item.price_per_unit,
          discount: item.discount,
        }))
      ),
    })) as Receipt[];
  } catch (error: any) {
    console.error("Error fetching receipts:", error);
    throw new Error("Failed to fetch receipts. Please try again later.");
  }
}

export async function getReceipt(id: string) {
  try {
    const supabase = await createClient();
    const { data: receips } = await supabase
      .from("receipts")
      .select("*,receipt_items(*)")
      .eq("id", id);

    if (!receips || receips.length === 0) {
      throw new Error(`Receipt not found`);
    }

    const receipt = receips[0];

    return {
      id: receipt.id,
      storeName: receipt.store_name,
      storeAddress: receipt.store_address,
      date: receipt.date,
      category: receipt.category,
      totalAmount: calculateTotal(receipt.receipt_items),
      items: receipt.receipt_items.map((item: any) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        pricePerUnit: item.price_per_unit,
        discount: item.discount,
      })),
    };
  } catch (error: any) {
    console.error("Error fetching receipt:", error);
    throw new Error("Failed to fetch receipt. Please try again later.");
  }
}

export async function createReceipt(formData: FormData) {
  try {
    const storeName = formData.get("storeName") as string;
    const storeAddress = formData.get("storeAddress") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const items = JSON.parse(formData.get("items") as string);

    const supabase = await createClient();

    const { data: receipts } = await supabase
      .from("receipts")
      .insert({
        store_name: storeName,
        store_address: storeAddress,
        date,
        category,
      })
      .select();

    if (!receipts || receipts.length === 0) {
      throw new Error("Failed to create receipt. Please try again later.");
    }

    const receipt = receipts[0];

    for (const item of items) {
      await supabase.from("receipt_items").insert({
        receipt_id: receipt.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price_per_unit: item.pricePerUnit,
        discount: item.discount,
      });
    }

    revalidatePath("/");
    return { id: receipt.id };
  } catch (error: any) {
    console.error("Error creating receipt:", error);
    throw new Error("Failed to create receipt. Please try again later.");
  }
}

export async function updateReceipt(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const storeName = formData.get("storeName") as string;
    const storeAddress = formData.get("storeAddress") as string;
    const date = formData.get("date") as string;
    const category = formData.get("category") as string;
    const items = JSON.parse(formData.get("items") as string);

    const totalAmount = calculateTotal(items);

    const supabase = await createClient();

    // Update receipt
    await supabase
      .from("receipts")
      .update({
        store_name: storeName,
        store_address: storeAddress,
        date,
        category,
      })
      .eq("id", id);

    // Delete existing items
    await supabase.from("receipt_items").delete().eq("receipt_id", id);

    // Insert updated items
    for (const item of items) {
      await supabase.from("receipt_items").insert({
        receipt_id: id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        price_per_unit: item.pricePerUnit,
        discount: item.discount,
      });
    }

    revalidatePath("/");
    revalidatePath(`/receipts/${id}`);
    return { id };
  } catch (error: any) {
    console.error("Error updating receipt:", error);
    throw new Error("Failed to update receipt. Please try again later.");
  }
}

export async function deleteReceipt(formData: FormData) {
  try {
    const supabase = await createClient();
    const id = formData.get("id") as string;
    await supabase.from("receipts").delete().eq("id", id);
    await supabase.from("receipt_items").delete().eq("receipt_id", id);

    revalidatePath("/");
  } catch (error: any) {
    console.error("Error deleting receipt:", error);
    throw new Error("Failed to delete receipt. Please try again later.");
  }
}
