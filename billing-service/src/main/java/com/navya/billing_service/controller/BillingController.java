package com.navya.billing_service.controller;

import com.navya.billing_service.model.BillingAccount;
import com.navya.billing_service.repository.BillingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/billing")
public class BillingController {

    private final BillingRepository billingRepository;

    public BillingController(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @GetMapping
    public ResponseEntity<List<BillingAccount>> getAllBillingAccounts() {
        return ResponseEntity.ok(billingRepository.findAll());
    }
}
