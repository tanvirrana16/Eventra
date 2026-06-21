import { useState } from 'react';
import { 
  Check, 
  Trash2, 
  Bell, 
  MailOpen, 
  Calendar, 
  Award, 
  Info,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function OrganizerNotifications({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead, 
  onDelete
}) {
  const [activeAction, setActiveAction] = useState(null);

  const getIcon = (type) => {
    switch (type) {
      case 'New Registration':
        return { icon: CheckCircle, bg: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
      case 'Event Published':
        return { icon: Calendar, bg: 'bg-blue-50 text-blue-600 border-blue-100' };
      case 'Certificate Generated':
        return { icon: Award, bg: 'bg-purple-50 text-purple-600 border-purple-100' };
      default:
        return { icon: Info, bg: 'bg-amber-50 text-amber-600 border-amber-100' };
    }
  };

  const handleMarkRead = async (id) => {
    setActiveAction(id);
    await onMarkRead(id);
    setActiveAction(null);
  };

  const handleMarkAllRead = async () => {
    setActiveAction('all');
    await onMarkAllRead();
    setActiveAction(null);
  };

  const handleDelete = async (id) => {
    setActiveAction(`delete-${id}`);
    await onDelete(id);
    setActiveAction(null);
  };

  const formatNotificationTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md p-6 sm:p-8 font-outfit text-left animate-fade-in select-none">
      
      {/* Header */}
      <div className="pb-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">System Notifications</h2>
          <p className="text-xs sm:text-sm text-slate-400 font-semibold mt-1">
            Stay updated with new registrations, event approvals, and organizer portal notifications.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={activeAction === 'all'}
            className="flex items-center space-x-2 py-2.5 px-4 bg-emerald-50 hover:bg-[#2E6F40] text-[#2E6F40] hover:text-white rounded-xl text-xs font-bold border border-emerald-100 transition-all cursor-pointer disabled:opacity-50"
          >
            {activeAction === 'all' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <MailOpen className="h-3.5 w-3.5" />
            )}
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications list feed */}
      <div className="mt-8 space-y-4 select-text">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const { icon: Icon, bg } = getIcon(notif.type);
            const isRead = notif.is_read;

            return (
              <div 
                key={notif.id}
                className={`p-5 rounded-2xl border flex items-start space-x-4 transition-all duration-300 ${
                  isRead 
                    ? 'bg-white border-slate-100 opacity-70' 
                    : 'bg-[#2E6F40]/5 border-emerald-100 shadow-sm'
                }`}
              >
                
                {/* Icon wrapper */}
                <div className={`p-3 rounded-xl border shrink-0 ${bg}`}>
                  <Icon className="h-5 w-5 animate-pulse" />
                </div>

                {/* Details text */}
                <div className="flex-1 text-left space-y-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-x-4">
                    <h3 className={`font-extrabold text-slate-800 text-sm sm:text-base ${
                      isRead ? 'text-slate-700' : 'text-slate-900 font-black'
                    }`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-400 font-semibold shrink-0">
                      {formatNotificationTime(notif.created_at)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed text-justify max-w-2xl pr-4">
                    {notif.message}
                  </p>
                </div>

                {/* Actions (Mark Single Read / Delete) */}
                <div className="flex space-x-1.5 shrink-0 self-center">
                  {!isRead && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      disabled={activeAction === notif.id}
                      className="p-2 text-slate-400 hover:text-emerald-700 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                      title="Mark as Read"
                    >
                      {activeAction === notif.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    disabled={activeAction === `delete-${notif.id}`}
                    className="p-2 text-slate-400 hover:text-rose-600 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                    title="Delete Notification"
                  >
                    {activeAction === `delete-${notif.id}` ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-slate-400 font-semibold text-sm flex flex-col items-center justify-center space-y-2.5">
            <Bell className="h-8 w-8 text-slate-300" />
            <p>Your notification tray is empty.</p>
          </div>
        )}
      </div>

    </div>
  );
}
