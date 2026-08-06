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

    @Override
    public void createBillingAccount(
            BillingRequest request,
            StreamObserver<BillingResponse> responseObserver) {

        log.info("CreateBillingAccount request received: {}", request);

        // Business logic
        // e.g. save billing account to database, perform calculations, etc.

        BillingResponse response = BillingResponse.newBuilder()
                .setAccountId("ACC-" + request.getPatientId())
                .setStatus("ACTIVE")
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}