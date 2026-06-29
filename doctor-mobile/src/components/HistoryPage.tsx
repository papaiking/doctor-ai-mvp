import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Heart, Thermometer, MessageSquareText } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  bloodPressureData, temperatureData, conversationList,
} from '../data/demoHealthData';

interface ExpandableSectionProps {
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title, icon, subtitle, defaultOpen = false, children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-text-main">{title}</h3>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gray-100 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BPChart: React.FC = () => (
  <div className="w-full">
    <div className="flex items-center gap-4 mb-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
        <span className="text-text-muted">Tâm thu</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
        <span className="text-text-muted">Tâm trương</span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={bloodPressureData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis domain={[60, 160]} tick={{ fontSize: 12, fill: '#6B7280' }} unit=" mmHg" />
        <Tooltip
          contentStyle={{
            borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <ReferenceLine y={120} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Tối đa', fontSize: 11, fill: '#EF4444', position: 'right' }} />
        <ReferenceLine y={80} stroke="#3B82F6" strokeDasharray="5 5" label={{ value: 'Tối thiểu', fontSize: 11, fill: '#3B82F6', position: 'right' }} />
        <Line type="monotone" dataKey="systolic" stroke="#EF4444" strokeWidth={2} dot={{ r: 4, fill: '#EF4444' }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="diastolic" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4, fill: '#3B82F6' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const TempChart: React.FC = () => (
  <div className="w-full">
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={temperatureData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6B7280' }} />
        <YAxis domain={[36, 39.5]} tick={{ fontSize: 12, fill: '#6B7280' }} unit=" °C" />
        <Tooltip
          contentStyle={{
            borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
        <ReferenceLine y={37} stroke="#10B981" strokeDasharray="5 5" label={{ value: 'Bình thường', fontSize: 11, fill: '#10B981', position: 'right' }} />
        <Line type="monotone" dataKey="temp" stroke="#F59E0B" strokeWidth={2} dot={{ r: 4, fill: '#F59E0B' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const ConversationList: React.FC = () => (
  <div className="space-y-2">
    {conversationList.map((item) => (
      <div
        key={item.id}
        className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <MessageSquareText className="w-4 h-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-text-main text-sm truncate">{item.title}</h4>
            <span className="text-xs text-text-muted shrink-0">{item.date}</span>
          </div>
          <p className="text-sm text-text-muted mt-0.5 line-clamp-1">{item.snippet}</p>
        </div>
      </div>
    ))}
  </div>
);

const HistoryPage: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto pt-[calc(64px+env(safe-area-inset-top))] pb-[calc(96px+env(safe-area-inset-bottom))]">
      <div className="px-6 py-6 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-text-main mb-2">Lịch sử sức khỏe</h1>

        <ExpandableSection
          title="Lịch sử huyết áp"
          icon={<Heart className="w-5 h-5 text-primary" />}
          subtitle="7 ngày gần nhất • Cập nhật 14/05/2026"
        >
          <BPChart />
        </ExpandableSection>

        <ExpandableSection
          title="Lịch sử thân nhiệt"
          icon={<Thermometer className="w-5 h-5 text-primary" />}
          subtitle="7 ngày gần nhất • Cập nhật 14/05/2026"
        >
          <TempChart />
        </ExpandableSection>

        <ExpandableSection
          title="Danh sách tư vấn"
          icon={<MessageSquareText className="w-5 h-5 text-primary" />}
          subtitle={`${conversationList.length} cuộc hội thoại`}
        >
          <ConversationList />
        </ExpandableSection>
      </div>
    </div>
  );
};

export default HistoryPage;
