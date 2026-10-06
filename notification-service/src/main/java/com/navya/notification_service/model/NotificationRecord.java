package com.navya.notification_service.model;

public class NotificationRecord {
    private String patientId;
    private String name;
    private String email;
    private String eventType;
    private String message;
    private long sentAt;

    public NotificationRecord() {}

    public NotificationRecord(String patientId, String name, String email, String eventType) {
        this.patientId = patientId;
        this.name = name;
        this.email = email;
        this.eventType = eventType;
        this.message = "Notification sent to " + email + " regarding event: " + eventType;
        this.sentAt = System.currentTimeMillis();
    }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public long getSentAt() { return sentAt; }
    public void setSentAt(long sentAt) { this.sentAt = sentAt; }
}
