import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getLowStocks } from "@/lib/dashboard/dashboard.api";
import { Badge } from "lucide-react";

export default async function LowStockCard() {
  const data = await getLowStocks();
  return (
    <Card className="mt-2 p-6 rounded-xl">
      <CardTitle>Low stock reels</CardTitle>
      <div className="flex flex-col items-end">
        {data ? (
          data.map(({ id, name, stock }) => (
            <div
              key={id}
              className="flex w-full m-2 items-center justify-between rounded-full bg-muted px-4 py-2 text-sm"
            >
              <span>{name}</span>
              <Badge className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                {stock}
              </Badge>
            </div>
          ))
        ) : (
          <p>No low stock reels.</p>
        )}
      </div>
      <CardContent></CardContent>
    </Card>
  );
}
