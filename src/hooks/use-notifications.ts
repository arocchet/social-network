'use client';

import { useState, useEffect } from 'react';

interface NotificationCounts {
  invitations: number;
  unreadMessages: number;
  upcomingEvents: number;
}

export function useNotifications() {
  const [counts, setCounts] = useState<NotificationCounts>({
    invitations: 0,
    unreadMessages: 0,
    upcomingEvents: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const loadNotificationCounts = async () => {
    try {
      setIsLoading(true);
      
      // Load group invitation counts
      const invitationsResponse = await fetch('/api/private/invitations');
      const invitationsData = await invitationsResponse.json();
      const groupInvitationCount = invitationsData.invitations?.length || 0;

      // Load friend request counts
      const friendRequestsResponse = await fetch('/api/private/friend-requests');
      const friendRequestsData = await friendRequestsResponse.json();
      const friendRequestCount = friendRequestsData.friendRequests?.length || 0;

      // Total invitations = group invitations + friend requests
      const totalInvitations = groupInvitationCount + friendRequestCount;

      // Load unread messages count
      const messagesResponse = await fetch('/api/private/notifications/unread-messages');
      const messagesData = await messagesResponse.json();
      const unreadMessagesCount = messagesData.count || 0;

      // Load upcoming events count (events in next 7 days)
      const eventsResponse = await fetch('/api/private/notifications/upcoming-events');
      const eventsData = await eventsResponse.json();
      const upcomingEventsCount = eventsData.count || 0;

      setCounts({
        invitations: totalInvitations,
        unreadMessages: unreadMessagesCount,
        upcomingEvents: upcomingEventsCount
      });
    } catch (error) {
      console.error('Error loading notification counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotificationCounts();
    
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(loadNotificationCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const markInvitationsAsRead = () => {
    setCounts(prev => ({ ...prev, invitations: 0 }));
  };

  const markMessagesAsRead = () => {
    setCounts(prev => ({ ...prev, unreadMessages: 0 }));
  };

  const markEventsAsRead = () => {
    setCounts(prev => ({ ...prev, upcomingEvents: 0 }));
  };

  const refreshCounts = () => {
    loadNotificationCounts();
  };

  return {
    counts,
    isLoading,
    markInvitationsAsRead,
    markMessagesAsRead,
    markEventsAsRead,
    refreshCounts
  };
}