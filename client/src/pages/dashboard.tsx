import { useState } from "react";
import { Helmet } from "react-helmet";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import ProblemsTable from "@/components/problems-table";
import EditModeModal from "@/components/edit-mode-modal";
import CsvPreviewModal from "@/components/csv-preview-modal";
import NotesEditorModal from "@/components/notes-editor-modal";
import { useEditMode } from "@/hooks/use-edit-mode";
import { Button } from "@/components/ui/button";
import { Download, Lock, Unlock, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { isEditMode, showModal, setShowModal, unlock } = useEditMode();
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [showNotesEditor, setShowNotesEditor] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");
  const [csvData, setCsvData] = useState<any>(null);
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const response = await fetch("/api/export");
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "problems_export.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: "Problems exported to CSV file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export problems",
        variant: "destructive",
      });
    }
  };


  const handleEditNotes = (problemId: string) => {
    setSelectedProblemId(problemId);
    setShowNotesEditor(true);
  };

  return (
    <>
      <Helmet>
        <title>LeetCode Problems Tracker - Problem Management System</title>
        <meta name="description" content="Comprehensive LeetCode problem tracking system with analytics dashboard, search functionality, and password-protected editing capabilities." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 font-inter">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <List className="text-primary text-2xl mr-3" />
                <h1 className="text-xl font-semibold text-gray-900">LeetCode Problems Tracker</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center"
                  data-testid="button-edit-mode"
                >
                  {isEditMode ? <Unlock className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
                  {isEditMode ? "Edit Mode Active" : "Enter Edit Mode"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleExport}
                  className="inline-flex items-center bg-green-600 text-white hover:bg-green-700"
                  data-testid="button-export"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnalyticsDashboard />
          <ProblemsTable 
            isEditMode={isEditMode} 
            onEditNotes={handleEditNotes}
          />
        </main>

        {/* Modals */}
        <EditModeModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onUnlock={unlock}
        />
        
        <CsvPreviewModal
          show={showCsvPreview}
          onClose={() => setShowCsvPreview(false)}
          csvData={csvData}
        />
        
        <NotesEditorModal
          show={showNotesEditor}
          onClose={() => setShowNotesEditor(false)}
          problemId={selectedProblemId}
        />
      </div>
    </>
  );
}
