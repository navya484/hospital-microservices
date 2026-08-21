package com.navya.notification_service.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import patient.events.PatientEvent;

@Service
public class PatientEventConsumer {

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

        } catch (Exception e) {
            System.err.println("Error processing patient event for notification: " + e.getMessage());
        }
    }
}