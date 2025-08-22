import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EditModeModalProps {
  show: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function EditModeModal({ show, onClose, onUnlock }: EditModeModalProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const validateKeyMutation = useMutation({
    mutationFn: async (editKey: string) => {
      const response = await apiRequest('POST', '/api/auth/edit-key', { key: editKey });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.valid) {
        onUnlock();
        onClose();
        setKey("");
        setError("");
        toast({
          title: "Edit mode enabled",
          description: "You can now edit problems and their status",
        });
      } else {
        setError("Invalid key. Please try again.");
        // Add shake animation
        const modal = document.getElementById('edit-key-modal');
        if (modal) {
          modal.classList.add('animate-pulse');
          setTimeout(() => modal.classList.remove('animate-pulse'), 300);
        }
      }
    },
    onError: () => {
      setError("Failed to validate key. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError("Please enter an edit key");
      return;
    }
    validateKeyMutation.mutate(key);
  };

  const handleClose = () => {
    setKey("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent id="edit-key-modal" className="max-w-md" data-testid="modal-edit-mode">
        <DialogHeader>
          <DialogTitle>Enter Edit Mode</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-600">
            Enter the edit key to unlock problem editing capabilities.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="editKey">Edit Key</Label>
            <Input
              id="editKey"
              type="password"
              placeholder="Enter edit key..."
              value={key}
              onChange={(e) => {
                setKey(e.target.value);
                setError("");
              }}
              data-testid="input-edit-key"
            />
            {error && (
              <p className="text-sm text-red-600" data-testid="text-key-error">
                {error}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              data-testid="button-cancel-edit-mode"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={validateKeyMutation.isPending}
              data-testid="button-unlock"
            >
              {validateKeyMutation.isPending ? "Validating..." : "Unlock"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
