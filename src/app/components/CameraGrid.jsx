'use client';

import { useState } from 'react';
import Link from 'next/link';
import CameraCard from './CameraCard';

export default function CameraGrid({ cameras, onRefresh }) {
  const [selectedCamera, setSelectedCamera] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cameras.map((camera) => (
        <Link
          key={camera._id}
          href={`/dashboard/cameras/${camera._id}`}
        >
          <CameraCard
            camera={camera}
            isSelected={selectedCamera === camera._id}
            onClick={() => setSelectedCamera(camera._id)}
          />
        </Link>
      ))}
    </div>
  );
}
