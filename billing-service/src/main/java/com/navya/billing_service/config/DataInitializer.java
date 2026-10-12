package com.navya.billing_service.config;

import com.navya.billing_service.model.BillingAccount;
import com.navya.billing_service.repository.BillingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);
    private final BillingRepository billingRepository;

    public DataInitializer(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @Override
    public void run(String... args) {
        if (billingRepository.count() == 0) {
            log.info("Billing accounts table is empty. Seeding initial accounts into PostgreSQL vault...");

            List<BillingAccount> initialAccounts = List.of(
                    new BillingAccount("ACC-f7f97357-02fc-4295-9537-15e4716e8af7", "f7f97357-02fc-4295-9537-15e4716e8af7", "ACTIVE", 0.0),
                    new BillingAccount("ACC-eb4e1f82-a45c-4ce9-a246-8606b60cfa8f", "eb4e1f82-a45c-4ce9-a246-8606b60cfa8f", "ACTIVE", 0.0),
                    new BillingAccount("ACC-demo-pending-account-101", "p-demo-4401", "PENDING", 150.00)
            );

            billingRepository.saveAll(initialAccounts);
            log.info("Successfully seeded {} billing accounts into PostgreSQL vault!", initialAccounts.size());
        } else {
            log.info("Billing table already contains {} accounts in PostgreSQL vault.", billingRepository.count());
        }
    }
}
