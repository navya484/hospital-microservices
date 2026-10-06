package com.navya.analytics_service.controller;

import com.navya.analytics_service.model.PatientEventRecord;
import com.navya.analytics_service.repository.AnalyticsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsController(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    // Returns all raw patient events
    @GetMapping("/events")
    public ResponseEntity<List<PatientEventRecord>> getEvents() {
        return ResponseEntity.ok(analyticsRepository.findAll());
    }

    // Returns summary stats like total patients registered, updated, deleted
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalEvents", analyticsRepository.getTotalEvents());
        summary.put("registered", analyticsRepository.countByEventType("REGISTERED"));
        summary.put("updated", analyticsRepository.countByEventType("UPDATED"));
        summary.put("deleted", analyticsRepository.countByEventType("DELETED"));
        return ResponseEntity.ok(summary);
    }
}
