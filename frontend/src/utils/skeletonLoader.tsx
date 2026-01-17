import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import React from "react";

const SkeletonLoader = () => {
  return (
    <div>
      <Card className="overflow-hidden animate-pulse pt-0">
        <div className="aspect-video bg-gray-200"></div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="text-right">
              <div className="h-5 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-4 bg-gray-200 rounded w-8 mx-auto mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
              </div>
            ))}
          </div>

          <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>

          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded flex-1"></div>
            <div className="h-8 bg-gray-200 rounded flex-1"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonLoader;
