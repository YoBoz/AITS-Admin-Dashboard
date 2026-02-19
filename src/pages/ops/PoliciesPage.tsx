// ──────────────────────────────────────
// Policies Page — Phase 8
// Manage zone and operational policies
// ──────────────────────────────────────

import React, { useState } from 'react';
import { usePoliciesStore } from '@/store/policies.store';
import { PolicyRuleCard } from '@/components/ops';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Card, 
  CardContent, 
} from '@/components/ui/Card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { 
  Shield, 
  Search, 
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { Policy, PolicyType, PolicyStatus } from '@/types/policy.types';

interface PoliciesPageProps {
  embedded?: boolean;
}

export default function PoliciesPage({ embedded }: PoliciesPageProps) {
  const { policies, addPolicy, togglePolicy } = usePoliciesStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PolicyType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PolicyStatus | 'all'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    description: '',
    type: 'restricted_zone' as PolicyType,
    zone: '',
  });

  // Filter policies
  const filteredPolicies = policies.filter((policy) => {
    if (search && !policy.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (typeFilter !== 'all' && policy.type !== typeFilter) {
      return false;
    }
    if (statusFilter !== 'all' && policy.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Stats
  const activePolicies = policies.filter(p => p.status === 'active').length;
  const inactivePolicies = policies.filter(p => p.status === 'inactive').length;
  const scheduledPolicies = policies.filter(p => p.status === 'scheduled').length;
  const totalViolations = policies.reduce((sum, p) => sum + (p.trigger_count || 0), 0);

  const handleCreatePolicy = () => {
    const policy: Policy = {
      id: `POL-${Date.now()}`,
      name: newPolicy.name,
      description: newPolicy.description,
      type: newPolicy.type,
      status: 'scheduled',
      conditions: [],
      actions: [],
      zone_ids: newPolicy.zone ? [newPolicy.zone] : [],
      gate_ids: [],
      overrides: [],
      created_at: new Date().toISOString(),
      created_by: 'Admin User',
      effective_from: null,
      effective_to: null,
      last_triggered_at: null,
      trigger_count: 0,
    };
    addPolicy(policy);
    setIsCreateOpen(false);
    setNewPolicy({
      name: '',
      description: '',
      type: 'restricted_zone' as PolicyType,
      zone: '',
    });
  };

  const createDialog = (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Create Policy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Policy</DialogTitle>
          <DialogDescription>
            Define a new operational policy
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Policy Name</Label>
            <Input
              placeholder="e.g., Gate Area Restriction"
              value={newPolicy.name}
              onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Type</Label>
            <Select 
              value={newPolicy.type} 
              onValueChange={(v: string) => setNewPolicy({ ...newPolicy, type: v as PolicyType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restricted_zone">Restricted Zone</SelectItem>
                <SelectItem value="no_entry">No Entry</SelectItem>
                <SelectItem value="speed_limit">Speed Limit</SelectItem>
                <SelectItem value="time_restricted">Time Restricted</SelectItem>
                <SelectItem value="wheel_lock_zone">Wheel Lock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Zone (optional)</Label>
            <Input
              placeholder="e.g., Terminal 2, Gate A1"
              value={newPolicy.zone}
              onChange={(e) => setNewPolicy({ ...newPolicy, zone: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe what this policy enforces..."
              value={newPolicy.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPolicy({ ...newPolicy, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreatePolicy} disabled={!newPolicy.name}>
            Create Policy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      {!embedded ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Policies
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage zone restrictions and operational policies
            </p>
          </div>
          {createDialog}
        </div>
      ) : (
        <div className="flex justify-end">
          {createDialog}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('active')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activePolicies}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('inactive')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-500/20">
                <XCircle className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inactivePolicies}</p>
                <p className="text-xs text-muted-foreground">Inactive</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setStatusFilter('scheduled')}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{scheduledPolicies}</p>
                <p className="text-xs text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViolations}</p>
                <p className="text-xs text-muted-foreground">Violations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(v: string) => setTypeFilter(v as PolicyType | 'all')}>
              <SelectTrigger className="w-full md:w-44">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="restricted_zone">Restricted Zone</SelectItem>
                <SelectItem value="no_entry">No Entry</SelectItem>
                <SelectItem value="speed_limit">Speed Limit</SelectItem>
                <SelectItem value="time_restricted">Time Restricted</SelectItem>
                <SelectItem value="wheel_lock_zone">Wheel Lock</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(v: string) => setStatusFilter(v as PolicyStatus | 'all')}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            
            {(typeFilter !== 'all' || statusFilter !== 'all') && (
              <Button variant="ghost" onClick={() => { setTypeFilter('all'); setStatusFilter('all'); }}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Policy List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPolicies.map((policy) => (
          <PolicyRuleCard
            key={policy.id}
            policy={policy}
            onToggle={() => togglePolicy(policy.id)}
            onEdit={() => console.log('Edit policy:', policy.id)}
          />
        ))}
        
        {filteredPolicies.length === 0 && (
          <Card className="md:col-span-2">
            <CardContent className="py-12 text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-1">No policies found</h3>
              <p className="text-sm text-muted-foreground">
                {search || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first policy to get started'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
