
const LoadingSpinner = ({ message = "Carregando..." }: { message?: string }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">{message}</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 dark:border-gray-200 mx-auto"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
