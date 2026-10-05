import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Input } from "@base-ui/react";

export type PendingArticle = {
  name: string;
  addAmount: number;
  currentAmount: number;
};

type ArticleConflictDialogProps = {
  pendingArticle: PendingArticle | null;
  onConfirm: (targetAmount: number) => void;
  onCancel: () => void;
};

export function ArticleConflictDialog({
  pendingArticle,
  onConfirm,
  onCancel,
}: ArticleConflictDialogProps) {
  const isOpen = Boolean(pendingArticle);

  const current = pendingArticle?.currentAmount ?? 0;
  const initialAdd = pendingArticle?.addAmount ?? 0;
  const defaultTotal = Number(current + initialAdd) || 0;

  const [targetAmount, setTargetAmount] = useState<number>(defaultTotal);

  function handleOnConfirm() {
    onConfirm(targetAmount);
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Artikel existiert bereits</AlertDialogTitle>
          <AlertDialogDescription>
            "{pendingArticle?.name}" ist bereits in der Liste (Menge:{" "}
            {pendingArticle?.currentAmount}). Möchtest du die Menge auf
            insgesamt {targetAmount} setzen?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Abbrechen</AlertDialogCancel>

          <div className="flex flex-row gap-2 w-full">
            <Input
              type="number"
              value={targetAmount === 0 ? "" : targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value) || 0)}
              className="w-1/4 text-right border-1 border-gray-300 rounded-md px-2"
            />
            <AlertDialogAction className="flex-1" onClick={handleOnConfirm}>
              Menge setzen
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
