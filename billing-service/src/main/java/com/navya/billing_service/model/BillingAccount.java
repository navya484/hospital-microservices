package com.navya.billing_service.model;

public class BillingAccount {
    private String accountId;
    private String patientId;
    private String status;
    private double balance;

    public BillingAccount() {}

    public BillingAccount(String accountId, String patientId, String status, double balance) {
        this.accountId = accountId;
        this.patientId = patientId;
        this.status = status;
        this.balance = balance;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
