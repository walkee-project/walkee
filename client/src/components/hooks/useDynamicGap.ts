import { useState, useEffect, useRef, useCallback } from "react";

export function useDynamicGap(sectionCount: number, minGap = 12, maxGap = 80) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [spacing, setSpacing] = useState({ gap: minGap, padding: minGap });

  if (sectionRefs.current.length !== sectionCount) {
    sectionRefs.current = Array(sectionCount).fill(null);
  }

  const calculateSpacing = useCallback(() => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    let totalSectionHeight = 0;

    sectionRefs.current.forEach((el) => {
      if (el) {
        totalSectionHeight += el.offsetHeight;
      }
    });

    const remaining = vh - totalSectionHeight;
    const totalSpaceCount = sectionCount - 1 + 2;

    if (totalSpaceCount > 0) {
      const spaceCandidate = remaining / totalSpaceCount;
      const finalSpace = Math.min(Math.max(spaceCandidate, minGap), maxGap);
      setSpacing({ gap: finalSpace, padding: finalSpace });
    }
  }, [sectionCount, minGap, maxGap]);

  // ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      calculateSpacing();
    });

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [calculateSpacing]);

  const getSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return {
    containerRef,
    getSectionRef,
    gap: spacing.gap,
    padding: spacing.padding,
    recalculate: calculateSpacing, // ✅ 이거 추가
  };
}
