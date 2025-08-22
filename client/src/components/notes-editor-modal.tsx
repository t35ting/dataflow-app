import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText } from "lucide-react";
import type { Problem } from "@shared/schema";

interface NotesEditorModalProps {
  show: boolean;
  onClose: () => void;
  problemId: string;
}

export default function NotesEditorModal({ show, onClose, problemId }: NotesEditorModalProps) {
  const [notes, setNotes] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: problem, isLoading } = useQuery<Problem>({
    queryKey: ['/api/problems', problemId],
    enabled: show && !!problemId,
    queryFn: async () => {
      const response = await fetch(`/api/problems/${problemId}`);
      if (!response.ok) throw new Error('Failed to fetch problem');
      return response.json();
    },
  });

  const saveNotesMutation = useMutation({
    mutationFn: async (updatedNotes: string) => {
      return apiRequest('PATCH', `/api/problems/${problemId}`, { notes: updatedNotes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/problems'] });
      setHasUnsavedChanges(false);
      toast({
        title: "Notes saved",
        description: "Problem notes updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Save failed",
        description: "Failed to save notes",
        variant: "destructive",
      });
    }
  });

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !notes) return;
    
    const autoSaveTimer = setTimeout(() => {
      saveNotesMutation.mutate(notes);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [notes, hasUnsavedChanges, saveNotesMutation]);

  // Initialize notes when problem loads
  useEffect(() => {
    if (problem) {
      setNotes(problem.notes || "");
      setHasUnsavedChanges(false);
    }
  }, [problem]);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    saveNotesMutation.mutate(notes);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        setNotes("");
        setHasUnsavedChanges(false);
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!show || !problemId) return null;

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-notes-editor">
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          {problem && (
            <p className="text-sm text-gray-600" data-testid="text-problem-info">
              {problem.title} - {problem.id}
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            rows={8}
            placeholder="Add your notes here... (Markdown supported)"
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            disabled={isLoading || saveNotesMutation.isPending}
            data-testid="textarea-notes"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <FileText className="mr-1 h-4 w-4" />
              Markdown supported
              {hasUnsavedChanges && (
                <span className="ml-2 text-orange-600">
                  • Unsaved changes (auto-save in 2s)
                </span>
              )}
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleClose}
                data-testid="button-cancel-notes"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!hasUnsavedChanges || saveNotesMutation.isPending}
                data-testid="button-save-notes"
              >
                {saveNotesMutation.isPending ? "Saving..." : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
