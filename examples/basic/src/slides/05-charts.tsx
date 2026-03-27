import {
  SlideLayout,
  Title,
  Body,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@reslide/core';
import type { ChartConfig } from '@reslide/core';
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart, Pie, PieChart } from 'recharts';

const barData = [
  { month: 'Jan', slides: 120, exports: 45 },
  { month: 'Feb', slides: 210, exports: 89 },
  { month: 'Mar', slides: 350, exports: 156 },
  { month: 'Apr', slides: 480, exports: 230 },
  { month: 'May', slides: 610, exports: 340 },
  { month: 'Jun', slides: 790, exports: 470 },
];

const barConfig = {
  slides: { label: 'Slides Created', color: 'hsl(var(--chart-1))' },
  exports: { label: 'Exports', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const lineData = [
  { week: 'W1', users: 50 },
  { week: 'W2', users: 120 },
  { week: 'W3', users: 280 },
  { week: 'W4', users: 410 },
  { week: 'W5', users: 650 },
  { week: 'W6', users: 890 },
];

const lineConfig = {
  users: { label: 'Active Users', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const pieData = [
  { format: 'Web', count: 450, fill: 'hsl(var(--chart-1))' },
  { format: 'PDF', count: 280, fill: 'hsl(var(--chart-2))' },
  { format: 'PPTX', count: 160, fill: 'hsl(var(--chart-4))' },
];

const pieConfig = {
  count: { label: 'Exports' },
  Web: { label: 'Web', color: 'hsl(var(--chart-1))' },
  PDF: { label: 'PDF', color: 'hsl(var(--chart-2))' },
  PPTX: { label: 'PPTX', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

export default function Charts() {
  return (
    <SlideLayout.Default>
      <Title>Charts & Data Visualization</Title>
      <Body>Built-in Recharts integration with theme-aware styling</Body>
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">Bar Chart</p>
          <ChartContainer config={barConfig} className="h-[200px] w-full">
            <BarChart data={barData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="slides" fill="var(--color-slides)" radius={4} />
              <Bar dataKey="exports" fill="var(--color-exports)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">Line Chart</p>
          <ChartContainer config={lineConfig} className="h-[200px] w-full">
            <LineChart data={lineData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--color-users)"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-muted-foreground">Pie Chart</p>
          <ChartContainer config={pieConfig} className="h-[200px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={pieData} dataKey="count" nameKey="format" innerRadius={40} />
              <ChartLegend content={<ChartLegendContent nameKey="format" />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </SlideLayout.Default>
  );
}
