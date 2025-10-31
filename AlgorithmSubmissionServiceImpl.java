package com.ignite.CBL.service.impl;

import com.ignite.CBL.dto.AlgorithmRequestDTO;
import com.ignite.CBL.dto.AlgorithmResponceDTO;
import com.ignite.CBL.entity.AlgorithmSubmission;
import com.ignite.CBL.entity.Problem;
import com.ignite.CBL.entity.User;
import com.ignite.CBL.exception.ResourceNotFoundException;
import com.ignite.CBL.repository.AlgorithmSubmissionRepository;
import com.ignite.CBL.repository.ProblemRepository;
import com.ignite.CBL.service.AlgorithmSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlgorithmSubmissionServiceImpl implements AlgorithmSubmissionService {
    @Value("${user.id}")
    private String userId;

    private final AlgorithmSubmissionRepository algorithmRepository;
    private final ProblemRepository problemRepository;

    @Override
    @Transactional
    public AlgorithmResponceDTO saveOrUpdateAlgorithm(AlgorithmRequestDTO algorithmRequestDTO) {
        log.info("💾 Saving/updating algorithm for problem: {} | user: {}", algorithmRequestDTO.getProblemId(), userId);

        Problem problem = problemRepository.findById(algorithmRequestDTO.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));
        
        AlgorithmSubmission submission = algorithmRepository
                .findByProblem_ProblemIdAndUser_UserId(algorithmRequestDTO.getProblemId(), userId)
                .orElse(new AlgorithmSubmission());
        
        // Get current time spent (null-safe)
        int currentTime = submission.getTotalSecondSpent() != null ? submission.getTotalSecondSpent() : 0;
        int timeIncrement = algorithmRequestDTO.getTotalSecondSpent() != null ? algorithmRequestDTO.getTotalSecondSpent() : 0;
        int newTotalTime = currentTime + timeIncrement;

        submission.setContent(algorithmRequestDTO.getContent() != null ? algorithmRequestDTO.getContent() : "");
        submission.setIsCorrect(algorithmRequestDTO.getIsCorrect() != null && algorithmRequestDTO.getIsCorrect());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setTotalSecondSpent(newTotalTime);
        submission.setProblem(problem);
        
        if (submission.getUser() == null) {
            User user = new User();
            user.setUserId(userId);
            submission.setUser(user);
        }
        
        AlgorithmSubmission saved = algorithmRepository.save(submission);
        log.info("✅ Algorithm saved | Total time: {}s (+{}s) | isCorrect: {} | version: {}",
                newTotalTime, timeIncrement, saved.getIsCorrect(), saved.getVersion());

        return convertToDTO(saved);
    }

    @Override
    public AlgorithmResponceDTO getAlgorithmByProblemId(Integer problemId) {
        log.debug("Fetching algorithm for problem: {}", problemId);
        
        return algorithmRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Algorithm submission not found"));
    }

    @Override
    public Boolean existByProblemId(Integer problemId) {
        log.debug("Checking if algorithm exists for problem: {} and user: {}", problemId, userId);
        return algorithmRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId).isPresent();
    }

    @Override
    public Boolean isAlgorithmCorrect(Integer problemId) {
        log.debug("Checking if algorithm is correct for problem: {}", problemId);
        return algorithmRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId)
                .map(AlgorithmSubmission::getIsCorrect)
                .orElseThrow(() -> new ResourceNotFoundException("Algorithm submission not found"));
    }

    private AlgorithmResponceDTO convertToDTO(AlgorithmSubmission submission) {
        AlgorithmResponceDTO dto = new AlgorithmResponceDTO();
        dto.setAlgorithmSubmissionId(submission.getAlgorithmId());
        dto.setContent(submission.getContent());
        dto.setIsCorrect(submission.getIsCorrect());
        dto.setProblemId(submission.getProblem().getProblemId());
        dto.setVersion(submission.getVersion());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setTotalSecondSpent(submission.getTotalSecondSpent() != null ? submission.getTotalSecondSpent() : 0);
        return dto;
    }
}
