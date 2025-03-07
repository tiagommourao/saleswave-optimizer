
import { FC, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'accent' | 'warning';
  className?: string;
}

const MetricCard: FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  onClick, 
  variant = 'default',
  className 
}) => {
  const variantStyles = {
    default: '',
    primary: 'border-l-4 border-l-sfa-primary',
    accent: 'border-l-4 border-l-sfa-accent',
    warning: 'border-l-4 border-l-amber-500',
  };

  return (
    <Card 
      className={cn('shadow-sm transition-all hover:shadow-md cursor-pointer', 
        variantStyles[variant],
        onClick ? 'hover:scale-[1.01]' : '',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-sfa-secondary">{title}</CardTitle>
        <div className="text-sfa-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-sfa-secondary mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
