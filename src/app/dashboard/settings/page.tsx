"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useSettings, GradeConfig } from "@/context/settings-context";
import {
    Building2,
    CalendarDays,
    Award,
    ShieldCheck,
    Save,
    Plus,
    Trash2,
    Settings2,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Lock,
    Key,
    Activity,
    AlertCircle,
    CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
    const {
        schoolProfile, updateSchoolProfile,
        academicYear, updateAcademicYear,
        grades, addGrade, updateGrade, deleteGrade,
        rolePermissions, updatePermission
    } = useSettings();

    const [profileForm, setProfileForm] = useState(schoolProfile);
    const [yearForm, setYearForm] = useState(academicYear);

    const [isGradeOpen, setIsGradeOpen] = useState(false);
    const [editingGradeIdx, setEditingGradeIdx] = useState<string | null>(null);
    const [gradeForm, setGradeForm] = useState<Omit<GradeConfig, 'id'>>({
        grade: "", minPercent: 0, maxPercent: 0, remark: ""
    });

    const handleSaveProfile = () => updateSchoolProfile(profileForm);
    const handleSaveYear = () => updateAcademicYear(yearForm);

    const handleOpenGrade = (g?: GradeConfig) => {
        if (g) {
            setEditingGradeIdx(g.id);
            setGradeForm({ grade: g.grade, minPercent: g.minPercent, maxPercent: g.maxPercent, remark: g.remark });
        } else {
            setEditingGradeIdx(null);
            setGradeForm({ grade: "", minPercent: 0, maxPercent: 0, remark: "" });
        }
        setIsGradeOpen(true);
    };

    const handleSaveGrade = () => {
        if (editingGradeIdx) {
            updateGrade(editingGradeIdx, gradeForm);
        } else {
            addGrade({ ...gradeForm, id: Math.random().toString(36).substr(2, 9) });
        }
        setIsGradeOpen(false);
    };

    return (
        <div className="flex flex-col gap-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">System Configuration</h1>
                    <p className="text-muted-foreground font-medium text-sm">Fine-tune institutional parameters, grading logic, and security protocols.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="rounded-xl px-3 py-1 border-2 font-black text-[10px] uppercase tracking-widest bg-emerald-50 text-emerald-700 border-emerald-200">
                        <Activity className="h-3 w-3 mr-1" /> System Operational
                    </Badge>
                </div>
            </header>

            <Tabs defaultValue="profile" className="space-y-8">
                <TabsList className="flex w-full md:w-auto p-1 bg-muted/50 rounded-2xl border overflow-x-auto h-auto no-scrollbar">
                    <TabsTrigger value="profile" className="flex-1 md:w-[180px] rounded-xl font-bold py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Building2 className="h-4 w-4" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="academic" className="flex-1 md:w-[180px] rounded-xl font-bold py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CalendarDays className="h-4 w-4" /> Academic
                    </TabsTrigger>
                    <TabsTrigger value="grading" className="flex-1 md:w-[180px] rounded-xl font-bold py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Award className="h-4 w-4" /> Grading
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="flex-1 md:w-[180px] rounded-xl font-bold py-3 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <ShieldCheck className="h-4 w-4" /> Security
                    </TabsTrigger>
                </TabsList>

                {/* 1. School Profile */}
                <TabsContent value="profile" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="border shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b py-8">
                            <CardTitle className="text-2xl font-black tracking-tight">Institutional Identity</CardTitle>
                            <CardDescription className="text-sm font-medium">This metadata serves as the primary identifier on official documentation.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Entity Legal Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            className="pl-10 h-12 rounded-xl border-2 font-bold"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Official Correspondence Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            type="email"
                                            className="pl-10 h-12 rounded-xl border-2 font-bold"
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm(p => ({ ...p, email: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Primary Contact Descriptor</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                                        <Input
                                            className="pl-10 h-12 rounded-xl border-2 font-bold"
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Geospatial Registry Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground/50" />
                                        <Textarea
                                            className="pl-10 rounded-xl border-2 font-bold min-h-[100px]"
                                            value={profileForm.address}
                                            onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-8 border-t">
                                <Button onClick={handleSaveProfile} className="gap-2 h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                                    <Save className="h-4 w-4" /> Persist Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 2. Academic Year */}
                <TabsContent value="academic" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="border shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b py-8">
                            <CardTitle className="text-2xl font-black tracking-tight">Temporal Scope</CardTitle>
                            <CardDescription className="text-sm font-medium">Define the active operational window for all academic tracking.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Active Session Key</label>
                                    <Input
                                        className="h-12 rounded-xl border-2 font-bold"
                                        placeholder="e.g. 2023-24"
                                        value={yearForm.activeYear}
                                        onChange={(e) => setYearForm(y => ({ ...y, activeYear: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Inception Date</label>
                                    <Input
                                        type="date"
                                        className="h-12 rounded-xl border-2 font-bold"
                                        value={yearForm.startDate}
                                        onChange={(e) => setYearForm(y => ({ ...y, startDate: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Termination Date</label>
                                    <Input
                                        type="date"
                                        className="h-12 rounded-xl border-2 font-bold"
                                        value={yearForm.endDate}
                                        onChange={(e) => setYearForm(y => ({ ...y, endDate: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-8 border-t">
                                <Button onClick={handleSaveYear} className="gap-2 h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20">
                                    <Save className="h-4 w-4" /> Sync Academic Clock
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* 3. Grading System */}
                <TabsContent value="grading" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="border shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-muted/10 border-b py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight">Merit Scale Logic</CardTitle>
                                <CardDescription className="text-sm font-medium">Configure percentage buckets for automated merit distribution.</CardDescription>
                            </div>
                            <Button onClick={() => handleOpenGrade()} className="gap-2 h-11 px-6 rounded-xl font-bold shadow-lg shadow-primary/20">
                                <Plus className="h-4 w-4" /> New Merit Rule
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="border-none">
                                        <TableHead className="pl-8 h-12 uppercase text-[10px] font-black tracking-widest">Merit String</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Floor %</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Ceiling %</TableHead>
                                        <TableHead className="h-12 uppercase text-[10px] font-black tracking-widest">Observational Remarks</TableHead>
                                        <TableHead className="text-right pr-8 h-12 uppercase text-[10px] font-black tracking-widest">Operations</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {grades.map((g) => (
                                        <TableRow key={g.id} className="group hover:bg-muted/20 border-b transition-colors">
                                            <TableCell className="pl-8 py-5">
                                                <Badge className="rounded-xl px-4 py-1.5 font-black text-sm bg-primary/10 text-primary border-none">Grade {g.grade}</Badge>
                                            </TableCell>
                                            <TableCell className="font-mono font-bold text-sm">{g.minPercent}%</TableCell>
                                            <TableCell className="font-mono font-bold text-sm">{g.maxPercent}%</TableCell>
                                            <TableCell className="text-muted-foreground font-medium text-xs max-w-[200px] truncate">{g.remark || "No auxiliary notes."}</TableCell>
                                            <TableCell className="text-right pr-8">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleOpenGrade(g)}>
                                                        <Settings2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 hover:bg-rose-100 hover:text-rose-600 transition-colors" onClick={() => deleteGrade(g.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Dialog open={isGradeOpen} onOpenChange={setIsGradeOpen}>
                        <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden max-w-md">
                            <div className="bg-primary p-8 text-primary-foreground relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
                                <DialogTitle className="text-2xl font-black tracking-tighter uppercase mb-1">Merit Protocol</DialogTitle>
                                <DialogDescription className="text-primary-foreground/80 font-medium font-sm">Establish a new performance evaluation threshold.</DialogDescription>
                            </div>

                            <div className="p-8 space-y-6 bg-card">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Grade Identifier</label>
                                    <Input
                                        placeholder="e.g. A+"
                                        className="rounded-xl border-2 h-11 font-bold"
                                        value={gradeForm.grade}
                                        onChange={(e) => setGradeForm(f => ({ ...f, grade: e.target.value }))}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Minimum Threshold %</label>
                                        <Input
                                            type="number"
                                            className="rounded-xl border-2 h-11 font-bold"
                                            value={gradeForm.minPercent}
                                            onChange={(e) => setGradeForm(f => ({ ...f, minPercent: Number(e.target.value) }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Maximum Ceiling %</label>
                                        <Input
                                            type="number"
                                            className="rounded-xl border-2 h-11 font-bold"
                                            value={gradeForm.maxPercent}
                                            onChange={(e) => setGradeForm(f => ({ ...f, maxPercent: Number(e.target.value) }))}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest ml-1 text-muted-foreground">Descriptor Narrative</label>
                                    <Input
                                        placeholder="e.g. Outstanding Performance Indices"
                                        className="rounded-xl border-2 h-11 font-bold"
                                        value={gradeForm.remark}
                                        onChange={(e) => setGradeForm(f => ({ ...f, remark: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="p-8 pt-2 bg-card flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-xl font-bold h-11 border-2" onClick={() => setIsGradeOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveGrade} className="flex-1 rounded-xl font-bold h-11 shadow-lg shadow-primary/20 bg-primary">Commit Rule</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </TabsContent>

                {/* 4. Permissions */}
                <TabsContent value="permissions" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Card className="border shadow-xl rounded-3xl overflow-hidden border-none bg-transparent shadow-none">
                        <div className="grid grid-cols-1 gap-12">
                            {rolePermissions.map((rp) => (
                                <div key={rp.role} className="space-y-6">
                                    <div className="flex items-center justify-between px-2">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                                                <Key className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black capitalize tracking-tight">{rp.role} Ecosystem</h3>
                                                <p className="text-sm font-medium text-muted-foreground">Granular control protocols for institutional {rp.role}s.</p>
                                            </div>
                                        </div>
                                        <Badge className="rounded-full px-4 py-1 bg-primary/5 text-primary border-primary/20 font-black text-xs">{rp.permissions.length} Active Modules</Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {rp.permissions.map((p) => (
                                            <Card key={p.module} className="group border shadow-md hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl overflow-hidden border-transparent hover:border-primary/20 bg-card">
                                                <CardHeader className="py-4 px-6 border-b bg-muted/20">
                                                    <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{p.module}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="px-6 py-6 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-muted-foreground">View Integrity</span>
                                                        <Switch
                                                            className="data-[state=checked]:bg-emerald-500"
                                                            checked={p.view}
                                                            onCheckedChange={(v) => updatePermission(rp.role, p.module, 'view', v)}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-muted-foreground">Injection Access</span>
                                                        <Switch
                                                            className="data-[state=checked]:bg-emerald-500"
                                                            checked={p.add}
                                                            onCheckedChange={(v) => updatePermission(rp.role, p.module, 'add', v)}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-muted-foreground">Modification Key</span>
                                                        <Switch
                                                            className="data-[state=checked]:bg-emerald-500"
                                                            checked={p.edit}
                                                            onCheckedChange={(v) => updatePermission(rp.role, p.module, 'edit', v)}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-muted-foreground">Purge Authority</span>
                                                        <Switch
                                                            className="data-[state=checked]:bg-emerald-500"
                                                            checked={p.delete}
                                                            onCheckedChange={(v) => updatePermission(rp.role, p.module, 'delete', v)}
                                                        />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
