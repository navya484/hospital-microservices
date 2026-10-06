package com.navya.notification_service.repository;

import com.navya.notification_service.model.NotificationRecord;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
public class NotificationRepository {

    private final List<NotificationRecord> notifications = Collections.synchronizedList(new ArrayList<>());

    public void save(NotificationRecord record) {
        notifications.add(record);
    }

    public List<NotificationRecord> findAll() {
        return new ArrayList<>(notifications);
    }
}
