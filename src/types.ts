export type OperatingMode = 'business' | 'after_hours';

export type Step =
  | 'landing'
  | 'welcome'
  | 'consent'
  | 'consent_declined'
  | 'main_menu'
  | 'service_select'
  | 'service_help'
  | 'service_docs'
  | 'service_docs_result'
  | 'staff_lookup'
  | 'staff_info'
  | 'staff_call'
  | 'staff_sms'
  | 'emergency_confirm'
  | 'crisis_support'
  | 'reserve_date'
  | 'reserve_time'
  | 'reserve_confirm'
  | 'reserve_complete'
  | 'reserve_list'
  | 'reserve_change_date'
  | 'reserve_change_time'
  | 'reserve_change_confirm'
  | 'reserve_cancel_confirm'
  | 'staff_schedule_changed'
  | 'system_error'
  | 'desk_guidance';

export interface ServiceItem {
  id: string;
  name: string;
  iconName: string;
  shortDesc: string;
  requiredDocs: DocItem[];
  helpQuestion: string;
}

export interface DocItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface StaffMember {
  id: string;
  name: string;
  department: string;
  phone: string;
  isAvailable: boolean;
}

export interface ClientProfile {
  name: string;
  phone: string;
  assignedStaffId?: string;
}

export interface Reservation {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  staffName: string;
  location: string;
  createdAt: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  serviceId: string;
  serviceName: string;
  staffName: string;
  location: string;
  purpose: string;
  status: 'completed' | 'scheduled' | 'cancelled';
  statusLabel: string;
  outcomeNotes: string;
}

export interface SystemState {
  operatingMode: OperatingMode;
  operatingHoursText: string;
  systemConnected: boolean;
  emergencyPhone: string;
  crisisPhone: string;
  staffMembers: StaffMember[];
  services: ServiceItem[];
  availableDates: string[];
  timeSlotsByDate: Record<string, string[]>;
  reservations: Reservation[];
}
