'use client';
import { useEffect } from 'react';
import { soulwareAI } from '../lib/soulware-core';

export default function SoulwareBootstrap() {
  useEffect(() => {
    soulwareAI.start();
    return () => {};
  }, []);
  return null;
}
