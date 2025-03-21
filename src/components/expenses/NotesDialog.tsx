
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NotesDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  expenseId: string;
  expenseName: string;
  initialNote: string | null;
}

const NotesDialog = ({
  isOpen,
  onOpenChange,
  expenseId,
  expenseName,
  initialNote,
}: NotesDialogProps) => {
  const [note, setNote] = useState(initialNote || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from("expenses")
        .update({ notes: note })
        .eq("id", expenseId);

      if (error) throw error;
      
      toast.success("Note saved successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Notes for {expenseName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add notes about this expense..."
            className="min-h-[150px]"
          />
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Note"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotesDialog;
