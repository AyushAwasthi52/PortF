'use client';

import { useCallback, useEffect } from 'react';

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Helper for white noise (used in metallic/rustle sounds)
const createNoiseBuffer = (ctx: AudioContext, duration: number) => {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

export const useAudio = () => {
  const initContext = useCallback(() => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      initContext();
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [initContext]);

  const playHover = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    // High pitched metallic click
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, []);

  const playSelect = useCallback(() => {
    // Basic select/examine sound
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  }, []);

  const playLift = useCallback(() => {
    // Mechanical unlatch (saw) + Laser beep (square)
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Laser beep
    const sqOsc = ctx.createOscillator();
    const sqGain = ctx.createGain();
    sqOsc.type = 'square';
    sqOsc.frequency.setValueAtTime(800, ctx.currentTime);
    sqOsc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
    
    sqGain.gain.setValueAtTime(0, ctx.currentTime);
    sqGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.01);
    sqGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    sqOsc.connect(sqGain);
    sqGain.connect(ctx.destination);
    sqOsc.start(ctx.currentTime);
    sqOsc.stop(ctx.currentTime + 0.15);

    // Mechanical unlatch
    const sawOsc = ctx.createOscillator();
    const sawGain = ctx.createGain();
    sawOsc.type = 'sawtooth';
    sawOsc.frequency.setValueAtTime(150, ctx.currentTime);
    sawOsc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
    
    sawGain.gain.setValueAtTime(0, ctx.currentTime);
    sawGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    sawGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    sawOsc.connect(sawGain);
    sawGain.connect(ctx.destination);
    sawOsc.start(ctx.currentTime);
    sawOsc.stop(ctx.currentTime + 0.2);
  }, []);

  const playPlace = useCallback(() => {
    // Mechanical click + Laser impact (no drum)
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Laser impact
    const sqOsc = ctx.createOscillator();
    const sqGain = ctx.createGain();
    sqOsc.type = 'square';
    sqOsc.frequency.setValueAtTime(600, ctx.currentTime);
    sqOsc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
    
    sqGain.gain.setValueAtTime(0, ctx.currentTime);
    sqGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.01);
    sqGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    sqOsc.connect(sqGain);
    sqGain.connect(ctx.destination);
    sqOsc.start(ctx.currentTime);
    sqOsc.stop(ctx.currentTime + 0.2);

    // Metallic latch (sawtooth)
    const sawOsc = ctx.createOscillator();
    const sawGain = ctx.createGain();
    sawOsc.type = 'sawtooth';
    sawOsc.frequency.setValueAtTime(200, ctx.currentTime);
    sawOsc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.15);
    
    sawGain.gain.setValueAtTime(0, ctx.currentTime);
    sawGain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    sawGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    
    sawOsc.connect(sawGain);
    sawGain.connect(ctx.destination);
    sawOsc.start(ctx.currentTime);
    sawOsc.stop(ctx.currentTime + 0.25);
  }, []);

  const playRotate = useCallback(() => {
    // Mechanical gear click
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  }, []);

  const playError = useCallback(() => {
    // Dull buzz for invalid placement
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.setValueAtTime(70, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  }, []);

  const playCaseOpen = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.6;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1500, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    noiseSource.start(ctx.currentTime);
  }, []);

  return { playHover, playSelect, playLift, playPlace, playRotate, playError, playCaseOpen, initContext };
};
