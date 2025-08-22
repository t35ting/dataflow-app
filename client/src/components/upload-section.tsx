import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CloudUpload, Download, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateCsv, parseCsvFile } from "@/lib/csv-utils";

interface UploadSectionProps {
  onCsvUpload: (data: any) => void;
}

export default function UploadSection({ onCsvUpload }: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 100);

      const csvData = await parseCsvFile(file);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        onCsvUpload(csvData);
      }, 500);

    } catch (error) {
      setIsUploading(false);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
        variant: "destructive",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const downloadTemplate = () => {
    const templateData = "ID,Title,Difficulty,Tags,Link\nLC001,Two Sum,Easy,Array;Hash Table,https://leetcode.com/problems/two-sum\nLC003,Longest Substring Without Repeating Characters,Medium,String;Sliding Window,https://leetcode.com/problems/longest-substring-without-repeating-characters";
    
    const blob = new Blob([templateData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'problems_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <section className="mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>CSV Upload</CardTitle>
          <Button 
            variant="ghost" 
            onClick={downloadTemplate}
            className="text-primary hover:text-blue-700"
            data-testid="button-download-template"
          >
            <Download className="mr-1 h-4 w-4" />
            Download Template
          </Button>
        </CardHeader>
        
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              isDragging ? "border-primary bg-blue-50" : "border-gray-300 hover:border-primary"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            data-testid="dropzone-upload"
          >
            <CloudUpload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop your CSV file here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Required columns: ID, Title, Difficulty, Tags, Link
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              data-testid="input-csv-file"
            />
            
            <Button 
              className="inline-flex items-center"
              data-testid="button-choose-file"
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </div>

          {isUploading && (
            <div className="mt-4" data-testid="upload-progress">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Processing CSV...</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
