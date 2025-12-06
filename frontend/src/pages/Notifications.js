import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, Bell, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications', {
        params: { token },
      });
      setNotifications(response.data);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notifId) => {
    try {
      await api.patch(`/notifications/${notifId}/read`, {}, {
        params: { token },
      });
      setNotifications(
        notifications.map((notif) =>
          notif.id === notifId ? { ...notif, read: true } : notif
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  return (
    <div data-testid="notifications-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            data-testid="back-button"
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">Notifications</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Your Notifications</h2>
          <p className="text-slate-400 text-lg">
            {notifications.filter(n => !n.read).length} unread messages
          </p>
        </div>

        <div className="glass-card">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="w-20 h-20 text-blue-500 mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-2xl text-white mb-2">No notifications</h3>
              <p className="text-slate-400">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  data-testid={`notification-${notification.id}`}
                  className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${
                    notification.read
                      ? 'bg-slate-950/30'
                      : 'bg-blue-500/10 border border-blue-500/20'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    notification.read ? 'bg-slate-800/50' : 'bg-blue-500/20'
                  }`}>
                    <Bell className={`w-6 h-6 ${
                      notification.read ? 'text-slate-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium mb-1 ${
                      notification.read ? 'text-slate-400' : 'text-white'
                    }`}>
                      {notification.message}
                    </p>
                    <p className="text-slate-500 text-xs">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => markAsRead(notification.id)}
                      className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl flex-shrink-0"
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}