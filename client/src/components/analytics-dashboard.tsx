import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { List, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { ProblemStats, DifficultyStats, TagStats } from "@shared/schema";

const DIFFICULTY_COLORS = {
  Easy: '#10B981',
  Medium: '#F59E0B', 
  Hard: '#EF4444',
  Unknown: '#6B7280'
};

export default function AnalyticsDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<ProblemStats>({
    queryKey: ['/api/analytics/stats'],
  });

  const { data: difficultyStats, isLoading: difficultyLoading } = useQuery<DifficultyStats[]>({
    queryKey: ['/api/analytics/difficulty'],
  });

  const { data: tagStats, isLoading: tagLoading } = useQuery<TagStats[]>({
    queryKey: ['/api/analytics/tags'],
  });

  if (statsLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const difficultyChartData = difficultyStats?.map(stat => ({
    ...stat,
    fill: DIFFICULTY_COLORS[stat.difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.Unknown
  })) || [];

  const tagChartData = tagStats?.slice(0, 5) || [];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <List className="text-primary text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Problems</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-total">
                  {stats?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-success text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Prepared</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-prepared">
                  {stats?.prepared || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="text-warning text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-in-progress">
                  {stats?.inProgress || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-error text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Not Prepared</p>
                <p className="text-2xl font-bold text-gray-900" data-testid="stat-not-prepared">
                  {stats?.notPrepared || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Difficulty Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {difficultyLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      nameKey="difficulty"
                    >
                      {difficultyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {tagLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tagChartData} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tag" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#1976D2" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
