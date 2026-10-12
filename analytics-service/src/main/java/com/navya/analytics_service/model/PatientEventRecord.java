package com.navya.analytics_service.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "analytics_events")
public class PatientEventRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String patientId;
    private String name;
    private String email;
    private String eventType;
    private long receivedAt;

    public PatientEventRecord() {}

    public PatientEventRecord(String patientId, String name, String email, String eventType) {
        this.patientId = patientId;
        this.name = name;
        this.email = email;
        this.eventType = eventType;
        this.receivedAt = System.currentTimeMillis();
    }

    public PatientEventRecord(String patientId, String name, String email, String eventType, long receivedAt) {
        this.patientId = patientId;
        this.name = name;
        this.email = email;
        this.eventType = eventType;
        this.receivedAt = receivedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public long getReceivedAt() { return receivedAt; }
    public void setReceivedAt(long receivedAt) { this.receivedAt = receivedAt; }
}
