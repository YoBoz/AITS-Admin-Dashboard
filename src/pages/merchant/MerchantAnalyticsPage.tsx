import { BarChart3 } from 'lucide-react';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Card, CardContent } from '@/components/ui/Card';

export default function MerchantAnalyticsPage() {
  return (
    <RequirePermission
      permission="analytics.view"
      fallback={
        <div className="space-y-6">
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Analytics</h1>
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold font-montserrat text-muted-foreground">
                Access Restricted
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Only Manager and Developer roles can view analytics.
              </p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground font-lexend mt-1">
            View shop performance, revenue, and trends
          </p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold font-montserrat text-muted-foreground">
              Analytics Dashboard
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed analytics will be available in a future phase.
            </p>
          </CardContent>
        </Card>
      </div>
    </RequirePermission>
  );
}
