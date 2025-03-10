
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
    primary: 'border-l-4 border-l-blue-500',
    accent: 'border-l-4 border-l-teal-500',
    warning: 'border-l-4 border-l-amber-500',
  };

  return (
    <Card 
      className={cn(
        'dashboard-card cursor-pointer transition-all hover:ring-1 hover:ring-blue-500/20',
        onClick ? 'hover:scale-[1.01]' : '',
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</CardTitle>
        <div className="text-blue-500 dark:text-blue-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold dark:text-white">{value}</div>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${
            trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
