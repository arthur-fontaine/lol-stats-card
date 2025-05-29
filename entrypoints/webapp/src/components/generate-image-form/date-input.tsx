import { useEffect, useRef, useState } from 'react';
import Calendar from 'react-calendar';

export function DateInput({
  value,
  onChange,
}: {
  value: [Date, Date];
  onChange: (dateRange: [Date, Date]) => void;
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const calendarElement = document.querySelector('.react-calendar');
      const targetElement = event.target as HTMLElement;
      if (
        calendarElement &&
        !calendarElement.contains(targetElement) &&
        !targetElement.closest('.date-input-button')
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="flex flex-1 items-center justify-center bg-white/15 border border-accent/20 rounded-lg cursor-pointer hover:bg-white/20 transition-colors px-4 h-10.5 min-h-10.5 max-h-10.5"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <span className="text-white/80">
          {value[0].toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })} - {value[1].toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </span>
      </button>
      {showCalendar && (
        <div className="absolute z-10 bg-white border border-accent/20 rounded-lg p-4 max-w-[calc(100dvw-72px)]">
          <Calendar
            onChange={(dateRange) => {
              if (!Array.isArray(dateRange)) return;
              if (dateRange.length !== 2) return;
              setDateRange(dateRange as [Date | null, Date | null]);
              if (dateRange[0] === null || dateRange[1] === null) return;
              onChange(dateRange as [Date, Date]);
              setShowCalendar(false);
            }}
            allowPartialRange
            value={value}
            ref={calendarRef}
            calendarType="iso8601"
            locale="en-US"
            next2Label={null}
            prev2Label={null}
            selectRange
            maxDate={dateRange[1] !== null ? undefined : dateRange[0] ? addDays(dateRange[0], 13) : undefined}
            minDate={dateRange[1] !== null ? undefined : dateRange[0] ? addDays(dateRange[0], -13) : undefined}
          />
          <button
            type="button"
            className="mt-4 bg-darkblue text-white py-2 px-4 rounded-lg w-full hover:bg-accent/80 transition-colors sm:hidden"
            onClick={() => {
              if (dateRange[0] && dateRange[1]) {
                onChange([dateRange[0], dateRange[1]]);
                setShowCalendar(false);
              }
            }}
          >
            Close and Apply
          </button>
        </div>
      )}
    </>
  );
}

function addDays(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
