package com.navya.hospital_management.service;

import com.navya.hospital_management.dto.PatientResponseDTO;
import com.navya.hospital_management.mapper.PatientMapper;
import com.navya.hospital_management.model.Patient;
import com.navya.hospital_management.repository.PatientRepository;
import com.navya.hospital_management.dto.PatientRequestDTO;
import org.springframework.stereotype.Service;
import com.navya.hospital_management.exception.EmailAlreadyExistsException;
import com.navya.hospital_management.exception.PatientNotFoundException;
import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import billing.BillingResponse;
import com.navya.hospital_management.grpc.BillingServiceGrpcClient;
import com.navya.hospital_management.kafka.KafkaProducer;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final BillingServiceGrpcClient billingServiceGrpcClient;
    private final KafkaProducer kafkaProducer;

    public PatientService(PatientRepository patientRepository, BillingServiceGrpcClient billingServiceGrpcClient, KafkaProducer kafkaProducer) {
        this.patientRepository = patientRepository;
        this.billingServiceGrpcClient = billingServiceGrpcClient;
        this.kafkaProducer = kafkaProducer;
    }

    public List<PatientResponseDTO> getPatients() {

        List<Patient> patients = patientRepository.findAll();

        List<PatientResponseDTO> patientResponseDTOs = patients.stream()
                .map(PatientMapper::toPatientResponseDTO)
                .toList();

        return patientResponseDTOs;
    }
    public PatientResponseDTO createPatient(PatientRequestDTO patientDTO) {
        if(patientRepository.existsByEmail(patientDTO.getEmail())) {
            throw new EmailAlreadyExistsException("A patient with this email"+"Email already exists" + patientDTO.getEmail());
        } 

        Patient newPatient = patientRepository.save(PatientMapper.toModel(patientDTO));
        BillingResponse billingResponse =
                billingServiceGrpcClient.createBillingAccount(
                        newPatient.getId().toString(),
                        newPatient.getName(),
                        newPatient.getEmail()
                );
        kafkaProducer.sendEvent(newPatient);

        return PatientMapper.toPatientResponseDTO(newPatient);
    } 

    public PatientResponseDTO updatePatient(UUID id, PatientRequestDTO patientRequestDTO) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with id: " + id));

        if(patientRepository.existsByEmailAndIdNot(patientRequestDTO.getEmail(), id)) {
            throw new EmailAlreadyExistsException("A patient with this email already exists: " + patientRequestDTO.getEmail());
        }

        patient.setName(patientRequestDTO.getName());
        patient.setEmail(patientRequestDTO.getEmail());
        patient.setAddress(patientRequestDTO.getAddress());
        patient.setDateOfBirth(LocalDate.parse(patientRequestDTO.getDateOfBirth()));

        Patient updatedPatient = patientRepository.save(patient);
        return PatientMapper.toPatientResponseDTO(updatedPatient);
    }

    public void deletePatient(UUID id){
        patientRepository.deleteById(id);
    }
} 