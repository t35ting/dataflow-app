import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { validateCsv } from "@/lib/csv-utils";
import type { ValidationReport } from "@shared/schema";

interface CsvPreviewModalProps {
  show: boolean;
  onClose: () => void;
  csvData: any;
}

export default function CsvPreviewModal({ show, onClose, csvData }: CsvPreviewModalProps) {
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [validatedRows, setValidatedRows] = useState<any[]>([]);
  const [isValidated, setIsValidated] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const validateMutation = useMutation({
    mutationFn: async (rows: any[]) => {
      const response = await apiRequest('POST', '/api/csv/validate', { rows });
      return response.json();
    },
    onSuccess: (data) => {
      setValidationReport(data.report);
      setValidatedRows(data.validatedRows);
      setIsValidated(true);
    },
    onError: () => {
      toast({
        title: "Validation failed",
        description: "Failed to validate CSV data",
        variant: "destructive",
      });
    }
  });

  const importMutation = useMutation({
    mutationFn: async (rows: any[]) => {
      const response = await apiRequest('POST', '/api/csv/import', { validatedRows: rows });
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      
      toast({
        title: "Import successful",
        description: `Added: ${result.added}, Updated: ${result.updated}, Skipped: ${result.skipped}`,
      });
      
      onClose();
    },
    onError: () => {
      toast({
        title: "Import failed",
        description: "Failed to import CSV data",
        variant: "destructive",
      });
    }
  });

  const handleValidate = () => {
    if (csvData?.rows) {
      validateMutation.mutate(csvData.rows);
    }
  };

  const handleImport = () => {
    if (validatedRows.length > 0) {
      importMutation.mutate(validatedRows);
    }
  };

  const downloadErrorReport = () => {
    if (!validationReport) return;
    
    const errors = validationReport.errors.map(e => 
      `Row ${e.row}, Field ${e.field}: ${e.message}`
    ).join('\n');
    
    const warnings = validationReport.warnings.map(w => 
      `Row ${w.row}, Field ${w.field}: ${w.message}`
    ).join('\n');
    
    const content = `Validation Report\n\nErrors:\n${errors}\n\nWarnings:\n${warnings}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation_report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!csvData) return null;

  const previewRows = csvData.rows?.slice(0, 20) || [];
  const totalRows = csvData.rows?.length || 0;
  const hasErrors = validationReport?.rowsWithErrors ? validationReport.rowsWithErrors > 0 : false;

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden" data-testid="modal-csv-preview">
        <DialogHeader>
          <DialogTitle>CSV Preview</DialogTitle>
          <p className="text-sm text-gray-600" data-testid="text-csv-summary">
            Found {totalRows} rows, showing first {Math.min(20, totalRows)}
          </p>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewRows.map((row: any, index: number) => (
                <TableRow key={index} data-testid={`row-preview-${index}`}>
                  <TableCell className="font-mono text-sm">{row.ID || row.id}</TableCell>
                  <TableCell>{row.Title || row.title}</TableCell>
                  <TableCell>{row.Difficulty || row.difficulty}</TableCell>
                  <TableCell>{row.Tags || row.tags}</TableCell>
                  <TableCell className="text-primary truncate max-w-xs">
                    {row.Link || row.link}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          {isValidated && validationReport && (
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600" data-testid="validation-summary">
                <Badge variant="outline" className="text-green-600 mr-2">
                  {validationReport.rowsOk} valid
                </Badge>
                <Badge variant="outline" className="text-yellow-600 mr-2">
                  {validationReport.rowsWithWarnings} warnings
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  {validationReport.rowsWithErrors} errors
                </Badge>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <div className="flex space-x-3">
              {isValidated && validationReport && (validationReport.errors.length > 0 || validationReport.warnings.length > 0) && (
                <Button 
                  variant="outline" 
                  onClick={downloadErrorReport}
                  data-testid="button-download-error-report"
                >
                  Download Error Report
                </Button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={onClose}
                data-testid="button-close-preview"
              >
                Cancel
              </Button>
              
              {!isValidated ? (
                <Button 
                  onClick={handleValidate}
                  disabled={validateMutation.isPending}
                  data-testid="button-validate-csv"
                >
                  {validateMutation.isPending ? "Validating..." : "Validate CSV"}
                </Button>
              ) : (
                <Button 
                  onClick={handleImport}
                  disabled={hasErrors || importMutation.isPending}
                  data-testid="button-import-data"
                >
                  {importMutation.isPending ? "Importing..." : "Import Data"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
