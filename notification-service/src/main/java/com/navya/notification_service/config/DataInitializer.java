package com.navya.notification_service.config;

import com.navya.notification_service.model.NotificationRecord;
import com.navya.notification_service.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final NotificationRepository notificationRepository;

    public DataInitializer(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void run(String... args) {
        if (notificationRepository.count() == 0) {
            log.info("Notifications table is empty. Seeding initial historical notifications into PostgreSQL vault...");

            long now = System.currentTimeMillis();
            long hour = 3600 * 1000L;

            List<NotificationRecord> initialNotifications = List.of(
                    new NotificationRecord("f7f97357-02fc-4295-9537-15e4716e8af7", "SasiDharan", "sasi@gmail.com", "REGISTERED", now - 5 * hour),
                    new NotificationRecord("eb4e1f82-a45c-4ce9-a246-8606b60cfa8f", "Jane Doe", "jane.doe@example.com", "REGISTERED", now - 4 * hour),
                    new NotificationRecord("a7f832fd-c31d-4eb6-ab21-4f175e6e1b8f", "Robert Brown", "robert.b@hospital.com", "REGISTERED", now - 3 * hour),
                    new NotificationRecord("eb4e1f82-a45c-4ce9-a246-8606b60cfa8f", "Jane Doe", "jane.doe@example.com", "UPDATED", now - 2 * hour),
                    new NotificationRecord("9251b08c-af0d-490d-bb4f-0c352d705dff", "Emily Clark", "emily.clark@health.org", "REGISTERED", now - 1 * hour),
                    new NotificationRecord("e568c7d1-ed4a-40e4-bb5f-2c0ebe10b7f9", "David Miller", "david.m@example.com", "REGISTERED", now - 30 * 60 * 1000L)
            );

            notificationRepository.saveAll(initialNotifications);
            log.info("Successfully seeded {} notifications into PostgreSQL vault!", initialNotifications.size());
        } else {
            log.info("Notifications table already contains {} records in PostgreSQL vault.", notificationRepository.count());
        }
    }
}
