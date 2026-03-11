import { useEffect, useRef } from 'react';

type SyncMessage =
  | { type: 'navigate'; slide: number; step: number; source: string }
  | { type: 'ping'; timestamp: number }
  | { type: 'pong'; timestamp: number };

const CHANNEL_NAME = 'reslide-sync';

interface UseBroadcastSyncOptions {
  source: string;
  currentSlide: number;
  currentStep: number;
  onNavigate: (slide: number, step: number) => void;
}

export function useBroadcastSync({
  source,
  currentSlide,
  currentStep,
  onNavigate,
}: UseBroadcastSyncOptions) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const suppressRef = useRef(false);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event: MessageEvent<SyncMessage>) => {
      const msg = event.data;
      if (msg.type === 'navigate' && msg.source !== source) {
        suppressRef.current = true;
        onNavigate(msg.slide, msg.step);
        // Allow next outgoing broadcast after a tick
        requestAnimationFrame(() => {
          suppressRef.current = false;
        });
      }
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [source, onNavigate]);

  // Broadcast navigation changes
  useEffect(() => {
    if (suppressRef.current) return;
    channelRef.current?.postMessage({
      type: 'navigate',
      slide: currentSlide,
      step: currentStep,
      source,
    } satisfies SyncMessage);
  }, [currentSlide, currentStep, source]);
}
