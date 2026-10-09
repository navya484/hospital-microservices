package com.navya.hospital_management.service;

import billing.BillingResponse;
import com.navya.hospital_management.dto.PatientRequestDTO;
import com.navya.hospital_management.dto.PatientResponseDTO;
import com.navya.hospital_management.exception.EmailAlreadyExistsException;
import com.navya.hospital_management.grpc.BillingServiceGrpcClient;
import com.navya.hospital_management.kafka.KafkaProducer;
import com.navya.hospital_management.model.Patient;
import com.navya.hospital_management.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // This tells JUnit to turn on Mockito
class PatientServiceTest {

    // 1. MOCK THE DEPENDENCIES (The "Fakes")
    @Mock
    private PatientRepository patientRepository;

    @Mock
    private BillingServiceGrpcClient billingServiceGrpcClient;

    @Mock
    private KafkaProducer kafkaProducer;

    // 2. INJECT THE MOCKS (Put the fakes inside the real service)
    @InjectMocks
    private PatientService patientService;

    private PatientRequestDTO requestDTO;
    private Patient savedPatient;

    @BeforeEach
    void setUp() {
        // This runs before every test to set up our dummy data
        requestDTO = new PatientRequestDTO();
        requestDTO.setName("John Doe");
        requestDTO.setEmail("john@example.com");
        requestDTO.setAddress("123 Main St");
        requestDTO.setDateOfBirth("1990-01-01");
        requestDTO.setRegisteredDate("2023-01-01");

        savedPatient = new Patient();
        savedPatient.setId(UUID.randomUUID());
        savedPatient.setName("John Doe");
        savedPatient.setEmail("john@example.com");
        savedPatient.setAddress("123 Main St");
        savedPatient.setDateOfBirth(LocalDate.of(1990, 1, 1));
        savedPatient.setRegisteredDate(LocalDate.of(2023, 1, 1));
    }

    @Test
    void createPatient_Success() {
        // --- 1. ARRANGE (Set up the rules for our mocks) ---
        // When the service asks if the email exists, the fake database says "No" (false)
        when(patientRepository.existsByEmail("john@example.com")).thenReturn(false);
        
        // When the service asks to save, the fake database returns our dummy patient
        when(patientRepository.save(any(Patient.class))).thenReturn(savedPatient);

        // When the service calls gRPC, the fake client returns a dummy success response
        BillingResponse fakeGrpcResponse = BillingResponse.newBuilder()
                .setStatus("SUCCESS")
                .setAccountId("acc-12345")
                .build();
        when(billingServiceGrpcClient.createBillingAccount(anyString(), anyString(), anyString()))
                .thenReturn(fakeGrpcResponse);

        // --- 2. ACT (Actually run the method we are testing) ---
        PatientResponseDTO result = patientService.createPatient(requestDTO);

        // --- 3. ASSERT (Verify the results are exactly what we expect) ---
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@example.com", result.getEmail());

        // Verify that our fakes were interacted with exactly one time each
        verify(patientRepository, times(1)).save(any(Patient.class));
        verify(billingServiceGrpcClient, times(1)).createBillingAccount(anyString(), anyString(), anyString());
        verify(kafkaProducer, times(1)).sendEvent(any(Patient.class));
    }

    @Test
    void createPatient_EmailAlreadyExists_ThrowsException() {
        // --- 1. ARRANGE ---
        // This time, the fake database says "Yes, this email is already taken!"
        when(patientRepository.existsByEmail("john@example.com")).thenReturn(true);

        // --- 2 & 3. ACT & ASSERT ---
        // We expect the service to immediately throw an EmailAlreadyExistsException
        assertThrows(EmailAlreadyExistsException.class, () -> {
            patientService.createPatient(requestDTO);
        });

        // Verify that we NEVER tried to save, call gRPC, or send to Kafka
        verify(patientRepository, never()).save(any(Patient.class));
        verify(billingServiceGrpcClient, never()).createBillingAccount(anyString(), anyString(), anyString());
        verify(kafkaProducer, never()).sendEvent(any(Patient.class));
    }
}
