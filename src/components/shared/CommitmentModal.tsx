import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CommitmentModalProps {
  roleName: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const commitmentContent: Record<string, string> = {
  Opportunist:
    "As a TİSYA Opportunist, I commit to showing up consistently, communicating proactively with my team, completing assigned tasks on time, and representing TİSYA with integrity in all interactions.",
  Ambassador:
    "As a TİSYA Ambassador, I commit to actively representing TİSYA in my designated scope, engaging my network authentically, reporting progress regularly, and upholding the values and mission of TİSYA.",
  "Country Union":
    "As a TİSYA Country Union affiliate, our organization commits to long-term structural collaboration, transparent communication, shared programming efforts, and mutual respect for TİSYA's mission and guidelines.",
};

const CommitmentModal = ({
  roleName,
  checked,
  onCheckedChange,
}: CommitmentModalProps) => {
  const content =
    commitmentContent[roleName] ||
    `As a TİSYA ${roleName}, I commit to upholding the values, responsibilities, and expectations of this role.`;

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
      <Checkbox
        id={`commitment-${roleName}`}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="mt-0.5"
      />
      <div className="space-y-1">
        <Label
          htmlFor={`commitment-${roleName}`}
          className="text-sm text-foreground leading-relaxed cursor-pointer"
        >
          I agree to the TİSYA {roleName} Commitment{" "}
          <span className="text-destructive">*</span>
        </Label>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default CommitmentModal;
