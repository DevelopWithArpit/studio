import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ToolSkeleton() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Skeleton className="h-9 w-1/2" />
        <Skeleton className="h-5 w-3/4" />
      </header>

      <Card>
        <CardHeader>
            <Skeleton className="h-7 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Skeleton className="h-4 w-1/5" />
                <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-10 w-24" />
        </CardContent>
      </Card>
    </div>
  );
}
