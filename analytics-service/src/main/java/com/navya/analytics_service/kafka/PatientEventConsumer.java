package com.navya.analytics_service.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import patient.events.PatientEvent;

@Service
public class PatientEventConsumer {

    @KafkaListener(
            topics = "patient",
            groupId = "analytics-service"
    )
    public void consumePatientEvent(byte[] message) {

        try {
            PatientEvent event = PatientEvent.parseFrom(message);

            System.out.println("Received Patient Event:");
            System.out.println("Patient ID: " + event.getPatientId());
            System.out.println("Name: " + event.getName());
            System.out.println("Email: " + event.getEmail());
            System.out.println("Event Type: " + event.getEventType());

        } catch (Exception e) {
            System.err.println("Error processing patient event: " + e.getMessage());
        }
    }
}