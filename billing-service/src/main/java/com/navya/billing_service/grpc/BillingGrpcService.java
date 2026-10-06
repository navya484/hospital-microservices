package com.navya.billing_service.grpc;

import billing.BillingRequest;
import billing.BillingResponse;
import billing.BillingServiceGrpc;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
public class BillingGrpcService extends BillingServiceGrpc.BillingServiceImplBase {

    private static final org.slf4j.Logger log =
            org.slf4j.LoggerFactory.getLogger(BillingGrpcService.class);

    private final com.navya.billing_service.repository.BillingRepository billingRepository;

    public BillingGrpcService(com.navya.billing_service.repository.BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @Override
    public void createBillingAccount(
            BillingRequest request,
            StreamObserver<BillingResponse> responseObserver) {

        log.info("CreateBillingAccount request received: {}", request);

        String accountId = "ACC-" + request.getPatientId();
        
        com.navya.billing_service.model.BillingAccount account = new com.navya.billing_service.model.BillingAccount(
                accountId, request.getPatientId(), "ACTIVE", 0.0);
        billingRepository.save(account);

        BillingResponse response = BillingResponse.newBuilder()
                .setAccountId(accountId)
                .setStatus("ACTIVE")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}