import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ROLE_PERMISSIONS } from '@/types/merchant.types';
import type { MerchantRole } from '@/types/merchant.types';
import { Shield, ChefHat, CreditCard, Code, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ROLE_META: Record<MerchantRole, { label: string; description: string; icon: LucideIcon; color: string }> = {
  manager: {
    label: 'Manager',
    description: 'Full access to all features including settings, analytics, and coupons.',
    icon: Shield,
    color: 'text-brand',
  },
  cashier: {
    label: 'Cashier',
    description: 'View and manage orders, redeem coupons at the counter.',
    icon: CreditCard,
    color: 'text-status-info',
  },
  kitchen: {
    label: 'Kitchen',
    description: 'View and progress orders through preparation stages.',
    icon: ChefHat,
    color: 'text-status-warning',
  },
  developer: {
    label: 'Developer',
    description: 'Full access plus API and developer-specific tools.',
    icon: Code,
    color: 'text-status-success',
  },
};

export default function MerchantRoleSwitcher() {
  const navigate = useNavigate();
  const { merchantUser, merchantRole, switchRole } = useMerchantAuth();

  if (!merchantUser) return null;

  const handleSwitch = (role: MerchantRole) => {
    switchRole(role);
    navigate('/merchant/orders');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold font-montserrat text-foreground mb-2">Switch Role</h1>
      <p className="text-sm text-muted-foreground font-lexend mb-8">
        Select a role to change your view and permissions.
      </p>

      <div className="grid gap-4">
        {merchantUser.available_roles.map((role, i) => {
          const meta = ROLE_META[role];
          const isActive = role === merchantRole;
          const permCount = ROLE_PERMISSIONS[role].length;

          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <button
                onClick={() => handleSwitch(role)}
                className="w-full text-left"
                disabled={isActive}
              >
                <Card
                  className={`transition-all hover:shadow-md ${
                    isActive ? 'ring-2 ring-primary border-primary' : 'hover:border-muted-foreground/40'
                  }`}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${meta.color}`}
                    >
                      <meta.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold font-poppins text-foreground">
                          {meta.label}
                        </h3>
                        {isActive && (
                          <Badge variant="success" className="text-[10px]">
                            <Check className="h-3 w-3 mr-0.5" />
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {permCount} permission{permCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
