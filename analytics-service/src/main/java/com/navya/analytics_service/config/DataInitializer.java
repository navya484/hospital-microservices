package com.navya.analytics_service.config;

import com.navya.analytics_service.model.PatientEventRecord;
import com.navya.analytics_service.repository.AnalyticsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final AnalyticsRepository analyticsRepository;

    public DataInitializer(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Override
    public void run(String... args) {
        if (analyticsRepository.count() == 0) {
            log.info("Analytics table is empty. Seeding initial historical sample events into PostgreSQL vault...");

            long now = System.currentTimeMillis();
            long hour = 3600 * 1000L;

            List<PatientEventRecord> sampleEvents = List.of(
                    new PatientEventRecord(UUID.randomUUID().toString(), "SasiDharan", "sasi@gmail.com", "REGISTERED", now - 5 * hour),
                    new PatientEventRecord(UUID.randomUUID().toString(), "Jane Doe", "jane.doe@example.com", "REGISTERED", now - 4 * hour),
                    new PatientEventRecord(UUID.randomUUID().toString(), "Robert Brown", "robert.b@hospital.com", "REGISTERED", now - 3 * hour),
                    new PatientEventRecord(UUID.randomUUID().toString(), "Jane Doe", "jane.doe@example.com", "UPDATED", now - 2 * hour),
                    new PatientEventRecord(UUID.randomUUID().toString(), "Emily Clark", "emily.clark@health.org", "REGISTERED", now - 1 * hour),
                    new PatientEventRecord(UUID.randomUUID().toString(), "David Miller", "david.m@example.com", "REGISTERED", now - 30 * 60 * 1000L)
            );

            analyticsRepository.saveAll(sampleEvents);
            log.info("Successfully seeded {} sample events into PostgreSQL analytics vault!", sampleEvents.size());
        } else {
            log.info("Analytics table already contains {} records in PostgreSQL vault.", analyticsRepository.count());
        }
    }
}
