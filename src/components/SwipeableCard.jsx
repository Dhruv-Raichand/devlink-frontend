import { useState } from "react";
import UserCard from "./UserCard";

const SwipeableCard = ({
  user,
  sendRequest,
  stackIndex = 0,
  disabled,
  isTop,
}) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Stack illusion — back card is slightly smaller, shifted down, darker
  const stackScale = 1 - stackIndex * 0.06;
  const stackTransY = stackIndex * 18; // peeks below
  const stackOpacity = stackIndex === 0 ? 1 : 0.6 + (1 - stackIndex) * 0.2;

  const handleStart = (x, y) => {
    if (!isTop || disabled) return;
    setStart({ x, y });
    setIsDragging(true);
  };

  const handleMove = (x, y) => {
    if (!isDragging || !start) return;
    setOffset({
      x: x - start.x,
      y: Math.max(Math.min(y - start.y, 30), -30),
    });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (offset.x > threshold) {
      setOffset({ x: window.innerWidth * 1.5, y: offset.y });
      sendRequest("interested", user._id);
    } else if (offset.x < -threshold) {
      setOffset({ x: -window.innerWidth * 1.5, y: offset.y });
      sendRequest("ignored", user._id);
    } else {
      setOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
    setStart(null);
  };

  const rotation = isTop ? Math.max(Math.min(offset.x / 22, 10), -10) : 0;

  return (
    <div
      className={`absolute touch-none select-none ${
        isTop ?
          isDragging ? "cursor-grabbing"
          : "cursor-grab"
        : "cursor-default pointer-events-none"
      }`}
      style={{
        width: "min(340px, 88vw)",
        left: "50%",
        top: "50%",
        opacity: stackOpacity,
        transform:
          isTop ?
            `translate(-50%, -50%)
             translateY(${stackTransY}px)
             translate(${offset.x}px, ${offset.y}px)
             rotate(${rotation}deg)
             scale(${stackScale})`
          : `translate(-50%, -50%)
             translateY(${stackTransY}px)
             scale(${stackScale})`,
        zIndex: 10 - stackIndex,
        transition:
          isDragging ? "none" : (
            "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease"
          ),
        willChange: "transform",
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) =>
        handleStart(e.touches[0].clientX, e.touches[0].clientY)
      }
      onTouchMove={(e) => {
        e.preventDefault();
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }}
      onTouchEnd={handleEnd}>
      <UserCard user={user} sendRequest={sendRequest} disabled={disabled} />

      {/* Subtle tinted overlay while dragging — no text stamps */}
      {isTop && offset.x > 60 && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            opacity: Math.min(offset.x / 120, 1),
          }}
        />
      )}
      {isTop && offset.x < -60 && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            opacity: Math.min(Math.abs(offset.x) / 120, 1),
          }}
        />
      )}
    </div>
  );
};

export default SwipeableCard;
