import {
  Flag,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  FolderCheck,
  Settings,
  AlertCircle,
  XCircle,
  FileWarning,
  PlusCircle,
  Plus,
  Trash2,
  Folder,
  Link as LinkIcon,
  AlertTriangle,
  Paperclip,
  X,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Circle,
  RotateCcw,
  Download,
  Upload,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';
import type { IconName } from '../../types';

const ICON_MAP: Record<IconName, LucideIcon> = {
  'flag': Flag,
  'layout-dashboard': LayoutDashboard,
  'calendar-days': CalendarDays,
  'book-open': BookOpen,
  'folder-check': FolderCheck,
  'settings': Settings,
  'alert-circle': AlertCircle,
  'x-circle': XCircle,
  'file-warning': FileWarning,
  'plus-circle': PlusCircle,
  'plus': Plus,
  'trash-2': Trash2,
  'folder': Folder,
  'link': LinkIcon,
  'alert-triangle': AlertTriangle,
  'paperclip': Paperclip,
  'x': X,
  'check-circle': CheckCircle,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'check': Check,
  'circle': Circle,
  'rotate-ccw': RotateCcw,
  'download': Download,
  'upload': Upload,
  'message-square': MessageSquare,
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'more-horizontal': MoreHorizontal,
};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  const IconComp = ICON_MAP[name];
  if (IconComp) {
    return <IconComp size={size} className={className} />;
  }
  return <span className={`font-bold ${className}`}>{name}</span>;
}

export default Icon;
