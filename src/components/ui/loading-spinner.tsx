import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 'md', className, label }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div 
        className={cn(
          "rounded-full border-primary/20 border-t-primary animate-spin",
          sizeClasses[size]
        )}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && (
        <span className="text-sm text-muted-foreground animate-pulse">{label}</span>
      )}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export function CardLoadingSpinner() {
  return (
    <div className="p-8 flex items-center justify-center">
      <LoadingSpinner size="md" />
    </div>
  );
}