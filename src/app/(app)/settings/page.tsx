import { Save } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LighthouseMark } from "@/components/shared/lighthouse-mark";

const users = [
  { name: "Pastor Kabelo Sithole", email: "admin@afmlighthouse.church", role: "Administrator" },
  { name: "Sis. Naledi Mokoena", email: "naledi@afmlighthouse.church", role: "Ministry Leader" },
  { name: "Bro. Mpho Zulu", email: "mpho@afmlighthouse.church", role: "Usher Coordinator" },
  { name: "Sis. Palesa Dlamini", email: "palesa@afmlighthouse.church", role: "Finance Officer" },
];

const brandColors = [
  { name: "Primary — Royal Blue", hex: "#123E73" },
  { name: "Secondary — Royal Blue", hex: "#2D6ECF" },
  { name: "Accent — Gold", hex: "#C9A227" },
  { name: "Success", hex: "#16A34A" },
  { name: "Warning", hex: "#F59E0B" },
  { name: "Danger", hex: "#DC2626" },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Settings"
        title="Church and account setup"
        description="Manage church details, users, permissions, branding, and notifications."
        actions={
          <Button className="gap-2">
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <Tabs defaultValue="general">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Church details</CardTitle>
              <CardDescription>Basic information used across certificates, receipts, and reports</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0">
                  <LighthouseMark />
                </div>
                <div>
                  <Button variant="outline" size="sm">Upload new logo</Button>
                  <p className="mt-1.5 text-xs text-muted-foreground">SVG or PNG, at least 256×256px</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="churchName">Church name</Label>
                  <Input id="churchName" defaultValue="AFM Lighthouse Church Vryburg" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="denomination">Denomination</Label>
                  <Input id="denomination" defaultValue="Apostolic Faith Mission" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Physical address</Label>
                  <Input id="address" defaultValue="Church Street, Vryburg, North West" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="phone">Church phone</Label>
                  <Input id="phone" defaultValue="+27 53 927 0000" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Church email</Label>
                  <Input id="email" defaultValue="office@afmlighthouse.church" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pastor">Senior pastor</Label>
                  <Input id="pastor" defaultValue="Pastor Kabelo Sithole" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Users & roles</CardTitle>
                <CardDescription>Manage who has access, and what they can do</CardDescription>
              </div>
              <Button size="sm">Invite user</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Access</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 text-xs">
                            <AvatarFallback>
                              {u.name
                                .split(" ")
                                .slice(-2)
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{u.name}</p>
                            <p className="text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Brand colours</CardTitle>
              <CardDescription>These colours are used consistently across the entire system</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {brandColors.map((c) => (
                <div key={c.hex} className="flex items-center gap-3 rounded-xl border border-border p-3">
                  <span className="h-9 w-9 shrink-0 rounded-lg border border-border" style={{ backgroundColor: c.hex }} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs uppercase text-muted-foreground">{c.hex}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification settings</CardTitle>
              <CardDescription>Choose what the team is notified about</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              {[
                { label: "New visitor registered", desc: "Notify assigned leaders immediately" },
                { label: "Follow-up reminders", desc: "Remind leaders 48 hours after a visit" },
                { label: "Giving received", desc: "Notify finance officers of new gifts" },
                { label: "Event registration milestones", desc: "Notify organisers at 50%, 80%, and 100% capacity" },
                { label: "Weekly summary email", desc: "Send a Monday morning digest to leadership" },
              ].map((n, i) => (
                <div key={n.label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={i !== 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
