package com.navya.notification_service.kafka;

import com.navya.notification_service.model.NotificationRecord;
import com.navya.notification_service.repository.NotificationRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import patient.events.PatientEvent;

@Service
public class PatientEventConsumer {

    private final NotificationRepository notificationRepository;
    private final com.navya.notification_service.controller.NotificationController notificationController;

    public PatientEventConsumer(NotificationRepository notificationRepository, 
                                com.navya.notification_service.controller.NotificationController notificationController) {
        this.notificationRepository = notificationRepository;
        this.notificationController = notificationController;
    }

    @KafkaListener(
            topics = "patient",
            groupId = "notification-service"
    )
    public void consumePatientEvent(byte[] message) {

        try {
            PatientEvent event = PatientEvent.parseFrom(message);

            System.out.println("--------------------------------------------------");
            System.out.println("[NOTIFICATION] Preparing to notify patient:");
            System.out.println("  Patient ID : " + event.getPatientId());
            System.out.println("  Name       : " + event.getName());
            System.out.println("  Email      : " + event.getEmail());
            System.out.println("  Event Type : " + event.getEventType());
            System.out.println("[NOTIFICATION] Would send email to " + event.getEmail()
                    + " regarding event: " + event.getEventType());
            System.out.println("--------------------------------------------------");

            // Save the notification record so the REST API can serve it
            NotificationRecord record = new NotificationRecord(
                    event.getPatientId(),
                    event.getName(),
                    event.getEmail(),
                    event.getEventType()
            );
            notificationRepository.save(record);
            
            // Dispatch to connected SSE clients
            notificationController.dispatch(record);

        } catch (Exception e) {
            System.err.println("Error processing patient event for notification: " + e.getMessage());
        }
    }
}