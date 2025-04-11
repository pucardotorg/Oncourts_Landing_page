import { useEffect, useRef, useState } from "react";
import { WhatsNewSection as WhatsNewSectionType } from "../../data/whatsNewConfig";
import styles from "../../styles/WhatsNewCard.module.css";

const WhatsNewCard: React.FC<{ section: WhatsNewSectionType }> = ({ section }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scrollAmountRef = useRef(0);

  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(cardElement);

    return () => {
      if (cardElement) {
        observer.unobserve(cardElement);
      }
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const speed = 2;
    const step = 1;

    const startAutoScroll = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }

      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainer.scrollHeight > scrollContainer.clientHeight) {
          if (isHovering) return;
          
          scrollAmountRef.current += step;
          scrollContainer.scrollTop = scrollAmountRef.current;

          if (scrollAmountRef.current >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
            scrollAmountRef.current = 0;
            scrollContainer.scrollTop = 0;
          }
        }
      }, speed * 100);
    };

    if (isVisible) {
      startAutoScroll();
    } else if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isVisible, isHovering, section.data]);

  const handleScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && isHovering) {
      scrollAmountRef.current = scrollContainer.scrollTop;
    }
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 w-full max-w-6xl mx-auto font-raleway"
    >
      <h3 className="text-2xl font-bold text-teal font-Raleway">{section.title}</h3>
      <p className="text-md text-darkGrey mt-2 font-Raleway">{section.subTitle}</p>

      <div
        ref={scrollRef}
        className={`mt-6 space-y-5 text-gray-700 max-h-48 overflow-y-auto ${styles.scrollContainer} ${
            isHovering ? styles.scrollbar : styles.scrollbarHide
          }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onScroll={handleScroll}
      >
        <ul className="space-y-5 pr-4">
          {section.data.map((item) => (
            <li key={item.id} className="border-l-2 border-teal pl-5">
              <p className="text-base">
                <strong className="text-gray-900">{item.title}</strong>
                {item.description ? ` – ${item.description}` : ""}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WhatsNewCard;