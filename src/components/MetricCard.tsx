
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
    default: 'dark:bg-gray-900/50 dark:border-gray-800',
    primary: 'border-l-4 border-l-sfa-primary dark:bg-gray-900/50 dark:border-gray-800 dark:border-l-blue-500',
    accent: 'border-l-4 border-l-sfa-accent dark:bg-gray-900/50 dark:border-gray-800 dark:border-l-blue-400',
    warning: 'border-l-4 border-l-amber-500 dark:bg-gray-900/50 dark:border-gray-800 dark:border-l-amber-500',
  };

  return (
    <Card 
      className={cn(
        'shadow-sm transition-all hover:shadow-md cursor-pointer backdrop-blur-md', 
        'dark:shadow-none dark:hover:shadow-none dark:hover:bg-gray-800/50',
        variantStyles[variant],
        onClick ? 'hover:scale-[1.01]' : '',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-sfa-secondary dark:text-gray-400">{title}</CardTitle>
        <div className="text-sfa-primary dark:text-blue-400">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold dark:text-white">{value}</div>
        {description && <p className="text-xs text-sfa-secondary dark:text-gray-400 mt-1">{description}</p>}
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
