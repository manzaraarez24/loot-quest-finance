import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";

interface BossFormDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (boss: { name: string; cost: number; dueDateStr: string }) => void;
    initialData?: { name: string; cost: number; dueDateStr: string } | null;
}

export function BossFormDialog({ isOpen, onClose, onSave, initialData }: BossFormDialogProps) {
    const { currency } = useCurrency();
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [dueDateStr, setDueDateStr] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setCost(initialData.cost.toString());
            setDueDateStr(initialData.dueDateStr);
        } else {
            setName("");
            setCost("");
            setDueDateStr("");
        }
    }, [initialData, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !cost || !dueDateStr) return;

        onSave({
            name,
            cost: Number(cost),
            dueDateStr,
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-panel border border-border/50 bg-background/95">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl text-foreground">
                        {initialData ? "Edit Boss Fight" : "Create New Boss Fight"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="boss-name" className="text-muted-foreground font-display">Enemy Name</Label>
                        <Input
                            id="boss-name"
                            placeholder="e.g. Electric Bill, Gym Membership"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-muted border-border font-body"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="boss-cost" className="text-muted-foreground font-display">Amount / HP ({currency})</Label>
                        <Input
                            id="boss-cost"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="e.g. 50.00"
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            className="bg-muted border-border font-body"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="boss-date" className="text-muted-foreground font-display">Due Date</Label>
                        <Input
                            id="boss-date"
                            type="date"
                            value={dueDateStr}
                            onChange={(e) => setDueDateStr(e.target.value)}
                            className="bg-muted border-border font-body"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-hp-critical hover:bg-hp-critical/80 text-background font-display font-black">
                            {initialData ? "Update Boss" : "Summon Boss"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
