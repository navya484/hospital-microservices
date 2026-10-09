package com.navya.notification_service.controller;

import com.navya.notification_service.model.NotificationRecord;
import com.navya.notification_service.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    private final java.util.concurrent.CopyOnWriteArrayList<org.springframework.web.servlet.mvc.method.annotation.SseEmitter> emitters = new java.util.concurrent.CopyOnWriteArrayList<>();

    @GetMapping
    public ResponseEntity<List<NotificationRecord>> getNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @GetMapping("/stream")
    public org.springframework.web.servlet.mvc.method.annotation.SseEmitter stream() {
        org.springframework.web.servlet.mvc.method.annotation.SseEmitter emitter = new org.springframework.web.servlet.mvc.method.annotation.SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    public void dispatch(NotificationRecord record) {
        for (org.springframework.web.servlet.mvc.method.annotation.SseEmitter emitter : emitters) {
            try {
                emitter.send(org.springframework.web.servlet.mvc.method.annotation.SseEmitter.event().name("notification").data(record));
            } catch (Exception e) {
                emitters.remove(emitter);
            }
        }
    }
}
