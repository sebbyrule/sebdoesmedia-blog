export function AudioPlayer({ src, label = "Listen to this episode" }: { src: string; label?: string }) {
  return (
    <div className="border rounded-xl p-4 bg-muted/30">
      <p className="text-sm font-medium mb-2 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary" />
        {label}
      </p>
      <audio controls className="w-full" src={src} preload="metadata">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
