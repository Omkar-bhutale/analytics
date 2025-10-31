package com.ignite.CBL.service.impl;

import com.ignite.CBL.dto.PseudoCodeRequestDTO;
import com.ignite.CBL.dto.PseudocodeResponceDTO;
import com.ignite.CBL.entity.Problem;
import com.ignite.CBL.entity.PseudocodeSubmission;
import com.ignite.CBL.entity.User;
import com.ignite.CBL.exception.ResourceNotFoundException;
import com.ignite.CBL.repository.ProblemRepository;
import com.ignite.CBL.repository.PseudocodeSubmissionRepository;
import com.ignite.CBL.service.AlgorithmSubmissionService;
import com.ignite.CBL.service.PseudocodeSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class PseudocodeSubmissionServiceImpl implements PseudocodeSubmissionService {
    @Value("${user.id}")
    private String userId;

    private final PseudocodeSubmissionRepository pseudocodeRepository;
    private final ProblemRepository problemRepository;
    private final AlgorithmSubmissionService algorithmSubmissionService;
    @Override
    @Transactional
    public PseudocodeResponceDTO saveOrUpdatePseudocode(PseudoCodeRequestDTO pseudoCodeRequestDTO) {
        log.info("💾 Saving/updating pseudocode for problem: {} | user: {}", pseudoCodeRequestDTO.getProblemId(), userId);

        // Check if algorithm exists and is correct
        if (!algorithmSubmissionService.isAlgorithmCorrect(pseudoCodeRequestDTO.getProblemId())) {
            throw new IllegalStateException("Cannot save pseudocode: Algorithm submission must exist and be correct first");
        }
        
        Problem problem = problemRepository.findById(pseudoCodeRequestDTO.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));
        
        PseudocodeSubmission submission = pseudocodeRepository
                .findByProblem_ProblemIdAndUser_UserId(pseudoCodeRequestDTO.getProblemId(), userId)
                .orElse(new PseudocodeSubmission());
        
        // Get current time spent (null-safe)
        int currentTime = submission.getTotalSecondSpent() != null ? submission.getTotalSecondSpent() : 0;
        int timeIncrement = pseudoCodeRequestDTO.getTotalSecondSpent() != null ? pseudoCodeRequestDTO.getTotalSecondSpent() : 0;
        int newTotalTime = currentTime + timeIncrement;

        submission.setContent(pseudoCodeRequestDTO.getContent() != null ? pseudoCodeRequestDTO.getContent() : "");
        submission.setIsCorrect(pseudoCodeRequestDTO.getIsCorrect() != null && pseudoCodeRequestDTO.getIsCorrect());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setTotalSecondSpent(newTotalTime);
        submission.setProblem(problem);
        
        if (submission.getUser() == null) {
            User user = new User();
            user.setUserId(userId);
            submission.setUser(user);
        }
        
        PseudocodeSubmission saved = pseudocodeRepository.save(submission);

        return convertToDTO(saved);
    }

    @Override
    public PseudocodeResponceDTO getPseudocodeByProblemId(Integer problemId) {
        log.debug("Fetching pseudocode for problem: {}", problemId);
        
        return pseudocodeRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Pseudocode submission not found"));
    }

    @Override
    public Boolean existByProblemId(Integer problemId) {
        log.debug("Checking if pseudocode exists for problem: {} and user: {}", problemId, userId);
        return pseudocodeRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId).isPresent();
    }

    @Override
    public Boolean isPseudocodeCorrect(Integer problemId) {
        log.debug("Checking if pseudocode is correct for problem: {}", problemId);
        return pseudocodeRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId)
                .map(PseudocodeSubmission::getIsCorrect)
                .orElseThrow(() -> new ResourceNotFoundException("Pseudocode submission not found"));
    }
    
    private PseudocodeResponceDTO convertToDTO(PseudocodeSubmission submission) {
        PseudocodeResponceDTO dto = new PseudocodeResponceDTO();
        dto.setPseudocodeSubmissionId(submission.getPseudocodeSubmissionId());
        dto.setContent(submission.getContent());
        dto.setIsCorrect(submission.getIsCorrect());
        dto.setProblemId(submission.getProblem().getProblemId());
        dto.setVersion(submission.getVersion());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setTotalSecondSpent(submission.getTotalSecondSpent() != null ? submission.getTotalSecondSpent() : 0);
        return dto;
    }
}
