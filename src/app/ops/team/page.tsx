"use client";

import { useState } from "react";
import { Info, Lock, Plus, Trash2, UsersRound } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, Pill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, PageHeader } from "@/components/ui/misc";
import { Field, Select, TextInput } from "@/components/ui/field";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useOps } from "@/lib/ops/store";
import type { AdminAccount, AdminRole } from "@/lib/ops/types";
import { formatDate, initialsOf } from "@/lib/format";

export default function OpsTeamPage() {
  const { admins, currentAdmin, removeAdmin } = useOps();
  const { toast } = useToast();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<AdminAccount | null>(null);
  const isSuper = currentAdmin?.role === "super-admin";

  return (
    <>
      <PageHeader
        title="Admin team"
        description="The people who can sign in to this console."
        action={
          isSuper ? (
            <Button onClick={() => setAdding(true)}>
              <Plus className="size-4" />
              Add admin
            </Button>
          ) : null
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-xl border border-line bg-surface-muted/60 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-forest-700 dark:text-gold-400" />
        <p className="text-[0.8125rem] leading-relaxed text-muted">
          Only people on this list can sign in to the console. For now the{" "}
          <strong className="text-ink">Go to admin</strong> button shows for every pilgrim
          account; once the backend is connected it will show only for these emails.
          {!isSuper ? " Only a super admin can add or remove people." : ""}
        </p>
      </div>

      <Card>
        <CardHeader title={`${admins.length} admins`} icon={<UsersRound className="size-4" />} />
        <ul className="divide-y divide-line">
          {admins.map((a) => {
            const [first = "", ...rest] = a.name.split(" ");
            const isMe = a.id === currentAdmin?.id;
            return (
              <li key={a.id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                <Avatar initials={initialsOf(first, rest.join(" ") || first)} tone="from-gold-500 to-gold-700" size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{a.name}</p>
                    {isMe ? <Pill tone="brand">You</Pill> : null}
                  </div>
                  <p className="truncate text-xs text-muted">{a.email}</p>
                </div>
                <div className="text-right">
                  <Badge tone={a.role === "super-admin" ? "gold" : "neutral"}>
                    {a.role === "super-admin" ? "Super admin" : "Staff"}
                  </Badge>
                  <p className="mt-1 text-[0.6875rem] text-muted">
                    Added {formatDate(a.addedAt)} by {a.addedBy}
                  </p>
                </div>
                {isSuper && !isMe ? (
                  <Button size="sm" variant="ghost" aria-label={`Remove ${a.name}`} onClick={() => setRemoving(a)}>
                    <Trash2 className="size-4" />
                  </Button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </Card>

      {adding ? <AddAdminModal onClose={() => setAdding(false)} /> : null}

      <Modal
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title={`Remove ${removing?.name ?? ""}?`}
        description="They lose console access straight away."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!removing) return;
                const result = removeAdmin(removing.id);
                if (result.ok) toast({ title: `${removing.name} removed`, tone: "info" });
                else toast({ title: "Could not remove", description: result.error, tone: "error" });
                setRemoving(null);
              }}
            >
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">Any support tickets assigned to them become unassigned.</p>
      </Modal>
    </>
  );
}

function AddAdminModal({ onClose }: { onClose: () => void }) {
  const { addAdmin } = useOps();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<AdminRole>("staff");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});

  function save() {
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = "Enter their full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    const result = addAdmin({ name, email, role, password });
    if (!result.ok) {
      setErrors({ form: result.error });
      return;
    }
    toast({
      title: `${name.trim()} added`,
      description: "Share the temporary password with them privately.",
    });
    onClose();
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Add an admin"
      description="Use the same email they sign in to HajjPath with."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save}>Add admin</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Full name" required error={errors.name} htmlFor="na-name">
          <TextInput id="na-name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Email" required error={errors.email ?? errors.form} htmlFor="na-email">
          <TextInput id="na-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field
          label="Role"
          htmlFor="na-role"
          hint={role === "super-admin" ? "Can do everything, including managing this team." : "Can work every queue but cannot manage the team."}
        >
          <Select id="na-role" value={role} onChange={(e) => setRole(e.target.value as AdminRole)}>
            <option value="staff">Staff</option>
            <option value="super-admin">Super admin</option>
          </Select>
        </Field>
        <Field label="Temporary password" required error={errors.password} htmlFor="na-password">
          <TextInput id="na-password" type="text" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-muted">
          <Lock className="mt-0.5 size-3.5 shrink-0" />
          In this demo the password is stored in this browser. With the backend connected
          it is hashed on the server and the new admin is asked to change it on first sign in.
        </p>
      </div>
    </Modal>
  );
}
