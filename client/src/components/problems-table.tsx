import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Problem, ProblemFilters } from "@shared/schema";

interface ProblemsTableProps {
  isEditMode: boolean;
  onEditNotes: (problemId: string) => void;
}

const DIFFICULTY_COLORS = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800", 
  Hard: "bg-red-100 text-red-800",
  Unknown: "bg-gray-100 text-gray-800"
};

const STATUS_COLORS = {
  "Not Prepared": "text-red-600",
  "In Progress": "text-yellow-600",
  "Prepared": "text-green-600"
};

export default function ProblemsTable({ isEditMode, onEditNotes }: ProblemsTableProps) {
  const [filters, setFilters] = useState<ProblemFilters>({
    search: "",
    difficulty: "",
    status: "",
    page: 1,
    limit: 50,
    sortBy: "id",
    sortOrder: "asc",
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['/api/problems', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
          params.append(key, value.toString());
        }
      });
      
      const response = await fetch(`/api/problems?${params}`);
      if (!response.ok) throw new Error('Failed to fetch problems');
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest('PATCH', `/api/problems/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/difficulty'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/tags'] });
      toast({
        title: "Status updated",
        description: "Problem status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update problem status",
        variant: "destructive",
      });
    }
  });

  const deleteProblemMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/problems/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/difficulty'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/tags'] });
      toast({
        title: "Problem deleted",
        description: "Problem deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete problem",
        variant: "destructive",
      });
    }
  });

  const handleStatusChange = (problemId: string, newStatus: string) => {
    updateStatusMutation.mutate({ id: problemId, status: newStatus });
  };

  const handleDelete = (problemId: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      deleteProblemMutation.mutate(problemId);
    }
  };

  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column as any,
      sortOrder: prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  const problems = data?.problems || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / filters.limit);

  return (
    <section>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Problems Table</h2>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search problems..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                  data-testid="input-search-problems"
                />
              </div>
              
              <Select
                value={filters.difficulty || "all"}
                onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: value === "all" ? "" : value as any, page: 1 }))}
              >
                <SelectTrigger className="w-[180px]" data-testid="select-difficulty-filter">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === "all" ? "" : value as any, page: 1 }))}
              >
                <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Not Prepared">Not Prepared</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Prepared">Prepared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("id")}
                    data-testid="header-id"
                  >
                    ID {filters.sortBy === "id" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("title")}
                    data-testid="header-title"
                  >
                    Title {filters.sortBy === "title" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("difficulty")}
                    data-testid="header-difficulty"
                  >
                    Difficulty {filters.sortBy === "difficulty" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("status")}
                    data-testid="header-status"
                  >
                    Status {filters.sortBy === "status" && (filters.sortOrder === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : problems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      No problems found. Upload a CSV file to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  problems.map((problem: Problem) => (
                    <TableRow key={problem.id} className="hover:bg-gray-50" data-testid={`row-problem-${problem.id}`}>
                      <TableCell className="font-mono text-sm" data-testid={`text-id-${problem.id}`}>
                        {problem.id}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" data-testid={`text-title-${problem.id}`}>
                        {problem.title}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={DIFFICULTY_COLORS[problem.difficulty as keyof typeof DIFFICULTY_COLORS]}
                          data-testid={`badge-difficulty-${problem.id}`}
                        >
                          {problem.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs"
                              data-testid={`badge-tag-${problem.id}-${index}`}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={problem.status}
                          onValueChange={(value) => handleStatusChange(problem.id, value)}
                          disabled={!isEditMode}
                        >
                          <SelectTrigger className={`w-[140px] border-0 bg-transparent ${STATUS_COLORS[problem.status as keyof typeof STATUS_COLORS]} font-medium`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not Prepared">Not Prepared</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Prepared">Prepared</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          data-testid={`link-external-${problem.id}`}
                        >
                          <a href={problem.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditNotes(problem.id)}
                            disabled={!isEditMode}
                            data-testid={`button-edit-notes-${problem.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(problem.id)}
                            disabled={!isEditMode}
                            className="text-red-600 hover:text-red-700"
                            data-testid={`button-delete-${problem.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {total > 0 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700" data-testid="pagination-info">
                  Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, total)} of {total} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={filters.page === 1}
                    data-testid="button-previous-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-sm text-gray-700">
                    Page {filters.page} of {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={filters.page === totalPages}
                    data-testid="button-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
