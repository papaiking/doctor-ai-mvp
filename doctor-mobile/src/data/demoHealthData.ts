export interface BPReading {
  date: string;
  systolic: number;
  diastolic: number;
}

export interface TempReading {
  date: string;
  temp: number;
}

export interface ConversationItem {
  id: string;
  title: string;
  date: string;
  snippet: string;
}

export const bloodPressureData: BPReading[] = [
  { date: '08/05', systolic: 135, diastolic: 85 },
  { date: '09/05', systolic: 142, diastolic: 90 },
  { date: '10/05', systolic: 138, diastolic: 88 },
  { date: '11/05', systolic: 145, diastolic: 92 },
  { date: '12/05', systolic: 130, diastolic: 82 },
  { date: '13/05', systolic: 128, diastolic: 80 },
  { date: '14/05', systolic: 132, diastolic: 84 },
];

export const temperatureData: TempReading[] = [
  { date: '08/05', temp: 36.8 },
  { date: '09/05', temp: 37.2 },
  { date: '10/05', temp: 38.5 },
  { date: '11/05', temp: 38.1 },
  { date: '12/05', temp: 37.0 },
  { date: '13/05', temp: 36.7 },
  { date: '14/05', temp: 36.6 },
];

export const conversationList: ConversationItem[] = [
  { id: '1', title: 'Đau đầu kéo dài', date: '12/05/2026', snippet: 'Tôi bị đau đầu vùng trán khoảng 1 tuần nay...' },
  { id: '2', title: 'Khám sức khỏe tổng quát', date: '10/05/2026', snippet: 'Tôi muốn đặt lịch khám sức khỏe định kỳ...' },
  { id: '3', title: 'Tư vấn tiêm chủng', date: '08/05/2026', snippet: 'Cần tiêm những loại vaccine nào cho người lớn...' },
  { id: '4', title: 'Dị ứng thời tiết', date: '05/05/2026', snippet: 'Mỗi khi chuyển mùa tôi thường bị nổi mẩn đỏ...' },
  { id: '5', title: 'Đau lưng khi ngồi nhiều', date: '01/05/2026', snippet: 'Làm việc văn phòng, ngồi nhiều bị đau lưng dưới...' },
];
