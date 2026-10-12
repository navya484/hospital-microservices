package com.navya.analytics_service.repository;

import com.navya.analytics_service.model.PatientEventRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<PatientEventRecord, Long> {

    @Query("SELECT COUNT(e) FROM PatientEventRecord e WHERE UPPER(e.eventType) = 'REGISTERED' OR UPPER(e.eventType) = 'PATIENT_CREATED'")
    long countRegistered();

    @Query("SELECT COUNT(e) FROM PatientEventRecord e WHERE UPPER(e.eventType) = 'UPDATED' OR UPPER(e.eventType) = 'PATIENT_UPDATED'")
    long countUpdated();

    @Query("SELECT COUNT(e) FROM PatientEventRecord e WHERE UPPER(e.eventType) = 'DELETED' OR UPPER(e.eventType) = 'PATIENT_DELETED'")
    long countDeleted();

    List<PatientEventRecord> findAllByOrderByReceivedAtAsc();
}
