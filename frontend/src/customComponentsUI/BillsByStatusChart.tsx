import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import { Bill } from "./BillsTable"
import { useMemo } from "react"

type Status = "Future" | "On-going" | "Finished"

const STATUS_COLORS: Record<Status, string> = {
    Future: "#8884d8",
    "On-going": "#20cd8d",
    Finished: "#ff6b6b",
}

export const BillsByStatusChart = ({ bills }: { bills: Bill[] }) => {
    const chartData = useMemo(() => {
        const counts: Record<Status, number> = {
            Future: 0,
            "On-going": 0,
            Finished: 0,
        }
        bills.forEach((bill) => {
            const status = bill.status as Status
            counts[status] = (counts[status] || 0) + 1
        })
        return Object.entries(counts).map(([status, value]) => ({
            status,
            value,
            fill: STATUS_COLORS[status as Status],
        }))
    }, [bills])

    const totalBills = useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.value, 0)
    }, [chartData])

    const chartConfig = {
        value: { label: "Bills" },
        Future: { label: "Future", color: STATUS_COLORS.Future },
        "On-going": { label: "On-going", color: STATUS_COLORS["On-going"] },
        Finished: { label: "Finished", color: STATUS_COLORS.Finished },
    } satisfies ChartConfig

    return (
        <Card className="flex flex-col w-full sm:w-80 md:w-96 lg:w-[350px] ">
            <CardHeader className="items-center pb-0">
                <CardTitle>Status distribution overview</CardTitle>
                <CardDescription>For all current trips</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="status"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalBills}
                                                </tspan>
                                                {/* <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total split bills
                                                </tspan> */}
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col gap-2 text-sm "> */}
            {/* <div className="flex items-center gap-2 leading-none font-medium">
                    Total bills overview <TrendingUp className="h-4 w-4" />
                </div> */}
            {/* <div className="text-muted-foreground leading-none ali">
                    Status distribution for all current trips
                </div> */}
            {/* </CardFooter> */}
        </Card>
    )
}
