package com.navya.analytics_service.repository;

import com.navya.analytics_service.model.PatientEventRecord;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;

@Repository
public class AnalyticsRepository {

    // A synchronized list so that multiple Kafka threads can safely add records
    private final List<PatientEventRecord> events = Collections.synchronizedList(new ArrayList<>());

    public void save(PatientEventRecord record) {
        events.add(record);
    }

    public List<PatientEventRecord> findAll() {
        return new ArrayList<>(events);
    }

    public long getTotalEvents() {
        return events.size();
    }

    public long countByEventType(String eventType) {
        return events.stream()
                .filter(e -> eventType.equalsIgnoreCase(e.getEventType()))
                .count();
    }
}
