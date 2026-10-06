package com.navya.billing_service.repository;

import com.navya.billing_service.model.BillingAccount;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class BillingRepository {
    private final ConcurrentHashMap<String, BillingAccount> accounts = new ConcurrentHashMap<>();

    public void save(BillingAccount account) {
        accounts.put(account.getAccountId(), account);
    }

    public List<BillingAccount> findAll() {
        return new ArrayList<>(accounts.values());
    }
}
