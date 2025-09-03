import { useState } from 'react';
import { Bell, Check, X, Calendar, Briefcase, Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/enhanced-button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function NotificationBell() {
  const { notifications, markNotificationRead, clearAllNotifications } = useAuth();
  const [open, setOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'event':
        return Calendar;
      case 'job':
        return Briefcase;
      case 'property':
        return Home;
      case 'friend_request':
        return Users;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'like':
      case 'friend_request':
        return 'text-blue-500';
      case 'comment':
        return 'text-green-500';
      case 'mention':
        return 'text-purple-500';
      case 'event':
        return 'text-orange-500';
      case 'job':
        return 'text-cyan-500';
      case 'property':
        return 'text-pink-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                      !notification.isRead && "bg-primary/5"
                    )}
                    onClick={() => markNotificationRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={cn("p-2 rounded-full bg-muted", getTypeColor(notification.type))}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <p className="text-sm text-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(notification.id);
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-sm"
              onClick={() => setOpen(false)}
            >
              View All Notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}