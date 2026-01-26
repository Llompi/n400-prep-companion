import { useMemo } from 'react';
import type { TimelineEvent, EventCategory, Document, UserSettings } from '../../types';
import { DEFAULT_EVENT_CATEGORIES } from '../../types';

interface TimelinePrintViewProps {
  events: TimelineEvent[];
  docs: Document[];
  settings: UserSettings;
  fromDate: string;
  toDate: string;
}

export function TimelinePrintView({
  events,
  docs,
  settings,
  fromDate,
  toDate,
}: TimelinePrintViewProps) {
  const eventCategories = settings.eventCategories || DEFAULT_EVENT_CATEGORIES;

  const getCategory = (typeId: string): EventCategory => {
    return eventCategories.find(c => c.id === typeId) || { id: typeId, label: typeId, color: 'slate' };
  };

  const getDocName = (docId: string) => {
    const doc = docs.find(d => d.id === docId);
    return doc?.name || docId;
  };

  const filteredAndSortedEvents = useMemo(() => {
    return [...events]
      .filter(ev => {
        const eventDate = new Date(ev.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && eventDate < from) return false;
        if (to && eventDate > to) return false;
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Oldest first for print
  }, [events, fromDate, toDate]);

  const formatDateRange = () => {
    if (fromDate && toDate) {
      return `${fromDate} to ${toDate}`;
    } else if (fromDate) {
      return `From ${fromDate}`;
    } else if (toDate) {
      return `Until ${toDate}`;
    }
    return 'All dates';
  };

  return (
    <div className="print-view bg-white text-black p-6">
      {/* Header */}
      <div className="print-header mb-6 pb-4 border-b-2 border-gray-300">
        <h1 className="text-2xl font-bold text-gray-900">Personal Timeline</h1>
        {settings.name && (
          <p className="text-sm text-gray-600 mt-1">Prepared by: {settings.name}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Date range: {formatDateRange()} | {filteredAndSortedEvents.length} event{filteredAndSortedEvents.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Compact Table View */}
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="text-left py-2 px-2 font-bold text-gray-700 w-28">Date</th>
            <th className="text-left py-2 px-2 font-bold text-gray-700 w-24">Category</th>
            <th className="text-left py-2 px-2 font-bold text-gray-700">Event</th>
            <th className="text-left py-2 px-2 font-bold text-gray-700 w-48">Documents</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedEvents.map((ev, index) => {
            const cat = getCategory(ev.type);
            const linkedDocs = ev.linkedDocIds?.map(id => getDocName(id)).join(', ') || '';
            const hasEvidence = (ev.linkedDocIds && ev.linkedDocIds.length > 0) || ev.evidenceLink;

            return (
              <tr
                key={ev.id}
                className={`print-event-row border-b border-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
              >
                <td className="py-2 px-2 align-top font-mono text-xs">
                  {ev.date}
                  {ev.endDate && (
                    <>
                      <br />
                      <span className="text-gray-500">to {ev.endDate}</span>
                    </>
                  )}
                </td>
                <td className="py-2 px-2 align-top">
                  <span className="text-xs font-semibold uppercase">
                    {cat.label}
                  </span>
                </td>
                <td className="py-2 px-2 align-top">
                  <div className="font-medium text-gray-900">{ev.title}</div>
                  {ev.desc && (
                    <div className="text-xs text-gray-600 mt-0.5">{ev.desc}</div>
                  )}
                </td>
                <td className="py-2 px-2 align-top text-xs">
                  {hasEvidence ? (
                    <>
                      {linkedDocs && <span className="text-gray-700">{linkedDocs}</span>}
                      {ev.evidenceLink && (
                        <span className="text-blue-600 block truncate max-w-[180px]">
                          {ev.evidenceLink}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-500 italic">No proof</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredAndSortedEvents.length === 0 && (
        <p className="text-center text-gray-500 py-8">No events found in the selected date range.</p>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500">
        <p>Generated on {new Date().toLocaleDateString()} | N-400 Prep Companion</p>
      </div>
    </div>
  );
}

export default TimelinePrintView;
