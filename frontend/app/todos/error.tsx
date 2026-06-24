'use client'; // Error components must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="bg-red-50 text-red-500 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">무언가 잘못되었습니다!</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">
        데이터를 불러오는 중 예기치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
      >
        다시 시도하기
      </button>
    </div>
  );
}
