import { useState, useEffect, useRef, useCallback } from "react";

export function useDynamicGap(sectionCount: number, minGap = 12, maxGap = 40) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  if (sectionRefs.current.length !== sectionCount) {
    sectionRefs.current = Array(sectionCount).fill(null);
  }

  const [spacing, setSpacing] = useState({ gap: minGap, padding: minGap });

  const calculateSpacing = useCallback(() => {
    if (!containerRef.current) return;

    const vh = window.innerHeight;
    let totalSectionHeight = 0;

    // 모든 섹션의 높이를 계산
    sectionRefs.current.forEach((el) => {
      if (el) {
        totalSectionHeight += el.offsetHeight;
      }
    });

    // 남은 공간 계산
    const remaining = vh - totalSectionHeight;

    // gap 개수: 섹션 사이사이 (sectionCount - 1)
    // padding 개수: 상단, 하단 (2개)
    const totalSpaceCount = sectionCount - 1 + 2;

    if (totalSpaceCount > 0) {
      const spaceCandidate = remaining / totalSpaceCount;
      const finalSpace = Math.min(Math.max(spaceCandidate, minGap), maxGap);

      setSpacing({ gap: finalSpace, padding: finalSpace });
    }
  }, [sectionCount, minGap, maxGap]);

  useEffect(() => {
    // 레이아웃이 완성된 후 계산하기 위해 setTimeout 사용
    const timer = setTimeout(() => {
      calculateSpacing();
    }, 0);

    const handleResize = () => {
      setTimeout(() => {
        calculateSpacing();
      }, 0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateSpacing]);

  // 컴포넌트가 완전히 렌더링된 후 다시 계산
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      calculateSpacing();
    });

    sectionRefs.current.forEach((el) => {
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [calculateSpacing]);

  // ref 할당 함수들을 제공
  const getSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionRefs.current[index] = el;
  };

  return {
    containerRef,
    getSectionRef,
    gap: spacing.gap,
    padding: spacing.padding,
  };
}
