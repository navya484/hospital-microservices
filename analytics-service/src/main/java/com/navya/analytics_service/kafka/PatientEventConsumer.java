package com.navya.analytics_service.kafka;

import com.navya.analytics_service.model.PatientEventRecord;
import com.navya.analytics_service.repository.AnalyticsRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import patient.events.PatientEvent;

@Service
public class PatientEventConsumer {

    private final AnalyticsRepository analyticsRepository;

    public PatientEventConsumer(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

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

            // Save the event to our in-memory store so the REST API can serve it
            PatientEventRecord record = new PatientEventRecord(
                    event.getPatientId(),
                    event.getName(),
                    event.getEmail(),
                    event.getEventType()
            );
            analyticsRepository.save(record);

        } catch (Exception e) {
            System.err.println("Error processing patient event: " + e.getMessage());
        }
    }
}