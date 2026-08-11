"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, UserPlus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { inviteUser, setUserRole, setUserStatus, deleteUser } from "@/lib/actions";
import { formatDate, initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

const statusTone: Record<Profile["status"], "success" | "warning" | "destructive"> = {
  approved: "success",
  pending: "warning",
  rejected: "destructive",
};

export function UsersRolesCard({
  profiles,
  currentUserId,
}: {
  profiles: Profile[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [manage, setManage] = React.useState<Profile | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await inviteUser({
        email: String(data.get("email") ?? ""),
        fullName: String(data.get("fullName") ?? ""),
        role: (data.get("role") as "admin" | "member") ?? "member",
      });
      toast.success(`Invite sent to ${result.email}`);
      toast.message("Temporary password", {
        description: `${result.password} — share this with the new user; they can change it in their profile.`,
        duration: 12000,
      });
      setInviteOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not invite that user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onRoleChange(role: "admin" | "member") {
    if (!manage) return;
    try {
      await setUserRole(manage.id, role);
      toast.success("Role updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the role.");
    }
  }

  async function onStatusChange(status: Profile["status"]) {
    if (!manage) return;
    try {
      await setUserStatus(manage.id, status);
      toast.success("Access updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update access.");
    }
  }

  async function onDelete() {
    if (!manage) return;
    if (!confirm(`Remove ${manage.fullName || manage.email}? Their sign-in is deleted permanently.`)) return;
    try {
      await deleteUser(manage.id);
      toast.success("User removed");
      setManage(null);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove that user.");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Users & roles</CardTitle>
          <CardDescription>Manage who has access, and what they can do</CardDescription>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="h-4 w-4" /> Invite user
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite a user</DialogTitle>
              <DialogDescription>
                They will receive a confirmation email. A temporary password is shown once — share it with them.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onInvite} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="inv-name">Full name</Label>
                <Input id="inv-name" name="fullName" placeholder="Sis. Palesa Dlamini" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="inv-email">Email</Label>
                <Input id="inv-email" name="email" type="email" placeholder="palesa@afmlighthouse.church" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Select name="role" defaultValue="member">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member — public site only</SelectItem>
                    <SelectItem value="admin">Administrator — full management access</SelectItem>
                  </SelectContent>
                </Select>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Invited admins must be approved on the Approvals tab before they can sign in.
                </p>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Inviting…" : "Send invite"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {profiles.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            title="No users yet"
            description="Invite someone to the church system and they will appear here."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => {
                const isYou = p.id === currentUserId;
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 text-xs">
                          <AvatarFallback>{initials(p.fullName || p.email || "U")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {p.fullName || "Unnamed"} {isYou && <span className="text-xs text-muted-foreground">(you)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.email ?? p.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={p.role === "admin" ? "gold" : "outline"} className="capitalize">
                        {p.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusTone[p.status]} className="capitalize">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setManage(p)}>
                        Manage
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={manage !== null} onOpenChange={(open) => !open && setManage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage {manage?.fullName || "user"}</DialogTitle>
            <DialogDescription>
              {manage?.email} · joined {manage?.createdAt ? formatDate(manage.createdAt) : "—"}
            </DialogDescription>
          </DialogHeader>
          {manage && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Select value={manage.role} onValueChange={(v) => onRoleChange(v as "admin" | "member")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Access</Label>
                <Select value={manage.status} onValueChange={(v) => onStatusChange(v as Profile["status"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Pending or rejected admins are locked out of the management system.
                </p>
              </div>
              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-auto gap-2 text-destructive hover:text-destructive"
                  disabled={manage.id === currentUserId}
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" /> Delete user
                </Button>
                <Button type="button" onClick={() => setManage(null)}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
