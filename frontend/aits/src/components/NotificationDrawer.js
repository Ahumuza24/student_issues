import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Typography, Badge } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getNotifications, markNotificationRead } from '../api';

const NotificationDrawer = ({ open, onClose }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotifications();
      setNotifications(res.data);
    };
    if (open) fetchNotifications();
  }, [open]);

  const handleMarkAsRead = async (id) => {
    await markNotificationRead(id);
    setNotifications(notifications.map(n => n.notification_id === id ? { ...n, is_read: true } : n));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div style={{ width: 300, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <List>
          {notifications.map(n => (
            <ListItem key={n.notification_id} button onClick={() => !n.is_read && handleMarkAsRead(n.notification_id)}>
              <ListItemText
                primary={n.message}
                secondary={new Date(n.sent_at).toLocaleString()}
                primaryTypographyProps={{ color: n.is_read ? 'textSecondary' : 'primary' }}
              />
              {!n.is_read && <Badge color="primary" variant="dot" />}
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
};

export default NotificationDrawer;