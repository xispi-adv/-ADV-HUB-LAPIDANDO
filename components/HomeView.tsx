import React, { useState, useRef } from 'react';
import TaskOverviewWidget from './dashboard/TaskOverviewWidget';
import CalendarWidget from './dashboard/CalendarWidget';
import MetricWidget from './dashboard/MetricWidget';
import EmailWidget from './dashboard/EmailWidget';
import ProductivityWidget from './dashboard/ProductivityWidget';
import AgendaWidget from './dashboard/AgendaWidget';
import AdsDashboardWidget from './dashboard/AdsDashboardWidget';

interface HomeViewProps {
  setActiveView: (view: string) => void;
}

const widgetComponents = {
  newClients: (props: any) => <MetricWidget title="Novos Clientes" value="120" change={0.12} period="vs. Mês Anterior" type="sparkline" trendData={[80, 90, 85, 100, 110, 105, 120]} />,
  totalRevenue: (props: any) => <MetricWidget title="Faturamento Total" value="R$ 50K" change={0.08} period="vs. Mês Anterior" type="radial" progress={75} />,
  taskOverview: (props: any) => <TaskOverviewWidget {...props} />,
  calendar: (props: any) => <CalendarWidget {...props} />,
  email: (props: any) => <EmailWidget {...props} />,
  agenda: (props: any) => <AgendaWidget {...props} />,
  productivity: (props: any) => <ProductivityWidget {...props} />,
  adsDashboard: (props: any) => <AdsDashboardWidget {...props} />,
};

interface Widget {
  id: keyof typeof widgetComponents;
  colSpan: string;
}

interface DashboardRow {
  id: string;
  items: Widget[];
}

const initialLayout: DashboardRow[] = [
    { id: `row-${Date.now()}-1`, items: [
        { id: 'newClients', colSpan: 'lg:col-span-1' },
        { id: 'totalRevenue', colSpan: 'lg:col-span-1' },
        { id: 'taskOverview', colSpan: 'lg:col-span-2' },
    ]},
    { id: `row-${Date.now()}-2`, items: [
        { id: 'calendar', colSpan: 'lg:col-span-1' },
        { id: 'email', colSpan: 'lg:col-span-1' },
        { id: 'agenda', colSpan: 'lg:col-span-1' },
        { id: 'productivity', colSpan: 'lg:col-span-1' },
    ]},
    { id: `row-${Date.now()}-3`, items: [
        { id: 'adsDashboard', colSpan: 'lg:col-span-4' },
    ]},
];

const HomeView: React.FC<HomeViewProps> = ({ setActiveView }) => {
  const [layout, setLayout] = useState<DashboardRow[]>(initialLayout);
  const dragItemData = useRef<{rowId: string, itemId: string} | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, rowId: string, itemId: string) => {
    dragItemData.current = { rowId, itemId };
    e.currentTarget.classList.add('opacity-30');
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
    e.preventDefault();
    if (dragItemData.current && dragItemData.current.itemId !== itemId) {
        setDragOverItemId(itemId);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverItemId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('opacity-30');
    setDragOverItemId(null);
    dragItemData.current = null;
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetRowId: string, targetItemId: string) => {
    e.preventDefault();
    if (!dragItemData.current) return;

    const { rowId: draggedRowId, itemId: draggedItemId } = dragItemData.current;
    
    // Prevent dropping on itself
    if (draggedRowId === targetRowId && draggedItemId === targetItemId) return;

    setLayout(prevLayout => {
        const newLayout = JSON.parse(JSON.stringify(prevLayout)); // Deep copy

        // Find indices for source (dragged) item
        const sourceRowIndex = newLayout.findIndex((r: DashboardRow) => r.id === draggedRowId);
        if (sourceRowIndex === -1) return prevLayout;
        const sourceItemIndex = newLayout[sourceRowIndex].items.findIndex((item: Widget) => item.id === draggedItemId);
        if (sourceItemIndex === -1) return prevLayout;

        // Find indices for target (drop) item
        const targetRowIndex = newLayout.findIndex((r: DashboardRow) => r.id === targetRowId);
        if (targetRowIndex === -1) return prevLayout;
        const targetItemIndex = newLayout[targetRowIndex].items.findIndex((item: Widget) => item.id === targetItemId);
        if (targetItemIndex === -1) return prevLayout;

        // Swap the items
        const draggedItem = newLayout[sourceRowIndex].items[sourceItemIndex];
        newLayout[sourceRowIndex].items[sourceItemIndex] = newLayout[targetRowIndex].items[targetItemIndex];
        newLayout[targetRowIndex].items[targetItemIndex] = draggedItem;

        return newLayout;
    });

    // Cleanup happens in onDragEnd
  };


  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      {layout.map((row) => (
        <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {row.items.map((widget) => {
            const WidgetComponent = widgetComponents[widget.id];
            const isDragOver = dragOverItemId === widget.id;
            return (
              <div
                key={widget.id}
                draggable
                onDragStart={(e) => handleDragStart(e, row.id, widget.id)}
                onDragEnter={(e) => handleDragEnter(e, widget.id)}
                onDragLeave={handleDragLeave}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, row.id, widget.id)}
                className={`${widget.colSpan} transition-all duration-300 cursor-grab active:cursor-grabbing ${isDragOver ? 'ring-2 ring-red-500 ring-offset-4 ring-offset-[#11052C]' : ''}`}
              >
                <WidgetComponent setActiveView={setActiveView} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default HomeView;