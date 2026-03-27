import {
  SlideLayout,
  Title,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@reslide/core';
import type { ChartConfig } from '@reslide/core';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
} from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 4200, users: 1800 },
  { month: 'Feb', revenue: 5100, users: 2400 },
  { month: 'Mar', revenue: 6800, users: 3200 },
  { month: 'Apr', revenue: 7400, users: 4100 },
  { month: 'May', revenue: 9200, users: 5300 },
  { month: 'Jun', revenue: 11800, users: 6800 },
];

const revenueConfig = {
  revenue: { label: 'Revenue', color: '#2563eb' },
  users: { label: 'Users', color: '#7c3aed' },
} satisfies ChartConfig;

const growthData = [
  { week: 'W1', value: 120 },
  { week: 'W2', value: 280 },
  { week: 'W3', value: 450 },
  { week: 'W4', value: 620 },
  { week: 'W5', value: 890 },
  { week: 'W6', value: 1240 },
];

const growthConfig = {
  value: { label: 'Growth', color: '#2563eb' },
} satisfies ChartConfig;

const shareData = [
  { name: 'Web', value: 48, fill: '#2563eb' },
  { name: 'PDF', value: 30, fill: '#7c3aed' },
  { name: 'PPTX', value: 22, fill: '#64748b' },
];

const shareConfig = {
  value: { label: 'Share' },
  Web: { label: 'Web', color: '#2563eb' },
  PDF: { label: 'PDF', color: '#7c3aed' },
  PPTX: { label: 'PPTX', color: '#64748b' },
} satisfies ChartConfig;

const activityData = [
  { day: 'Mon', created: 32, exported: 18 },
  { day: 'Tue', created: 45, exported: 28 },
  { day: 'Wed', created: 58, exported: 35 },
  { day: 'Thu', created: 42, exported: 22 },
  { day: 'Fri', created: 67, exported: 48 },
];

const activityConfig = {
  created: { label: 'Created', color: '#2563eb' },
  exported: { label: 'Exported', color: '#7c3aed' },
} satisfies ChartConfig;

export default function Charts() {
  return (
    <SlideLayout.Blank>
      <div className="flex flex-col w-full h-full p-12 gap-5">
        <div>
          <Title>Charts & Data Visualization</Title>
          <p className="text-xl text-muted-foreground -mt-2">
            Built-in Recharts integration with theme-aware styling
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 flex-1 min-h-0">
          {/* Bar Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Monthly Revenue</CardTitle>
              <CardDescription>Revenue vs user growth over 6 months</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <ChartContainer config={revenueConfig} className="h-full w-full">
                <BarChart data={revenueData} barGap={4}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="users" fill="var(--color-users)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Area Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User Growth</CardTitle>
              <CardDescription>Weekly active users trending upward</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <ChartContainer config={growthConfig} className="h-full w-full">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={2.5}
                    fill="url(#growthGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Export Formats</CardTitle>
              <CardDescription>Distribution by output type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <ChartContainer config={shareConfig} className="h-full w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={shareData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="45%"
                    outerRadius="75%"
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Weekly Activity</CardTitle>
              <CardDescription>Slides created vs exported per day</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 pb-4">
              <ChartContainer config={activityConfig} className="h-full w-full">
                <LineChart data={activityData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line
                    type="monotone"
                    dataKey="created"
                    stroke="var(--color-created)"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="exported"
                    stroke="var(--color-exported)"
                    strokeWidth={2.5}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </SlideLayout.Blank>
  );
}
