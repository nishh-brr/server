import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b1e2d' }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}
