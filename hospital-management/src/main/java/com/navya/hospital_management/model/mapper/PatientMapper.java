package com.navya.hospital_management.mapper;

import com.navya.hospital_management.dto.PatientRequestDTO;
import com.navya.hospital_management.dto.PatientResponseDTO;
import com.navya.hospital_management.model.Patient;

import java.time.LocalDate;

public class PatientMapper {

    public static PatientResponseDTO toPatientResponseDTO(Patient patient) {

        PatientResponseDTO patientDTO = new PatientResponseDTO();

        patientDTO.setId(patient.getId().toString());
        patientDTO.setName(patient.getName());
        patientDTO.setEmail(patient.getEmail());
        patientDTO.setAddress(patient.getAddress());
        patientDTO.setDateOfBirth(patient.getDateOfBirth().toString());
        patientDTO.setRegisteredDate(patient.getRegisteredDate().toString());

        return patientDTO;
    }

    public static Patient toModel(PatientRequestDTO patientDTO) {

        Patient patient = new Patient();

        // Do NOT set the ID here.
        // JPA will generate it automatically.

        patient.setName(patientDTO.getName());
        patient.setEmail(patientDTO.getEmail());
        patient.setAddress(patientDTO.getAddress());
        patient.setDateOfBirth(LocalDate.parse(patientDTO.getDateOfBirth()));
        patient.setRegisteredDate(LocalDate.parse(patientDTO.getRegisteredDate()));

        return patient;
    }
}