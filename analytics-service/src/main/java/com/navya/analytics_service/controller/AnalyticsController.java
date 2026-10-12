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

    // Returns all raw patient events ordered chronologically
    @GetMapping("/events")
    public ResponseEntity<List<PatientEventRecord>> getEvents() {
        return ResponseEntity.ok(analyticsRepository.findAllByOrderByReceivedAtAsc());
    }

    // Returns summary stats like total patients registered, updated, deleted from PostgreSQL
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Long>> getSummary() {
        Map<String, Long> summary = new HashMap<>();
        summary.put("totalEvents", analyticsRepository.count());
        summary.put("registered", analyticsRepository.countRegistered());
        summary.put("updated", analyticsRepository.countUpdated());
        summary.put("deleted", analyticsRepository.countDeleted());
        return ResponseEntity.ok(summary);
    }
}
