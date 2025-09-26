import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, CartesianGrid } from "recharts";
import { Bill } from "./BillsTable";

type BillBySpendingProps = {
    bills: Bill[];
};

export const BillBySpending = ({ bills }: BillBySpendingProps) => {
    const spendingData = useMemo(() => {
        return bills
            .map((bill) => ({
                billName: bill.billName,
                total: parseFloat(bill.totalAmount.replace("$", "")),
            }))
            .filter((bill) => bill.total > 0);
    }, [bills]);

    const chartConfig = {
        total: {
            label: "Total spend",
            color: "var(--chart-2)",
        },
    } as const;

    const [activeChart] = useState<keyof typeof chartConfig>("total");

    const totalSpend = useMemo(() => {
        return spendingData.reduce((acc, curr) => acc + curr.total, 0);
    }, [spendingData]);

    return (
        <Card className="py-0 flex flex-col w-full sm:w-[600px] lg:w-[1100px]">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>Spending overview</CardTitle>
                    <CardDescription>Total spent per split bill</CardDescription>
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <BarChart
                        data={spendingData}
                        margin={{ left: 12, right: 12 }}
                        barSize={30}
                    >
                        <CartesianGrid vertical={false} stroke="#e0e0e0" />
                        {/* <XAxis
                            dataKey="billName"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval={0}
                        /> */}
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="total"
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>

            {/* <CardContent className="px-6 pb-4">
                <div className="text-muted-foreground font-medium">
                    Total spent across all bills: ${totalSpend.toFixed(2)}
                </div>
            </CardContent> */}
        </Card>
    );
};
