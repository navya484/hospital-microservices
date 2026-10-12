package com.navya.billing_service.repository;

import com.navya.billing_service.model.BillingAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillingRepository extends JpaRepository<BillingAccount, String> {
    Optional<BillingAccount> findByPatientId(String patientId);
}
