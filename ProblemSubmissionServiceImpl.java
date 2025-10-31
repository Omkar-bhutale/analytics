package com.ignite.CBL.service.impl;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ignite.CBL.dto.*;
import com.ignite.CBL.entity.*;
import com.ignite.CBL.exception.ResourceNotFoundException;
import com.ignite.CBL.repository.*;
import com.ignite.CBL.service.AlgorithmSubmissionService;
import com.ignite.CBL.service.ProblemReportService;
import com.ignite.CBL.service.ProblemSubmissionService;
import com.ignite.CBL.service.PseudocodeSubmissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProblemSubmissionServiceImpl implements ProblemSubmissionService {

    @Value("${user.id}")
    private String userId;

    private final ProblemRepository problemRepository;
    private final AlgorithmSubmissionService algorithmSubmissionService;
    private final PseudocodeSubmissionService pseudocodeSubmissionService;
    private final UserProblemEngagementRepository userProblemEngagementRepository;
    private final UserRepository userRepository;
    private final ProblemSubmissionRepository problemSubmissionRepository;
    private final UserProblemReportRepository userProblemReportRepository;
    private final MainTopicRepository mainTopicRepository;
    private final TopicRepository topicRepository;
    private final ProblemReportService problemReportService;

    @Override
    @Transactional
    public ProblemCodeResponceDTO getProblemToSolve(Integer problemId) {
        log.info("Getting problem to solve for problemId: {} and userId: {}", problemId, userId);
        
        // Verify algorithm submission is correct
//        if (!algorithmSubmissionService.isAlgorithmCorrect(problemId)) {
//            throw new IllegalStateException("Algorithm submission must be correct before solving the problem");
//        }
//
//        // Verify pseudocode submission is correct
//        if (!pseudocodeSubmissionService.isPseudocodeCorrect(problemId)) {
//            throw new IllegalStateException("Pseudocode submission must be correct before solving the problem");
//        }

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
        
        // Fetch or create UserProblemEngagement
        UserProblemEngagement engagement = getOrCreateUserProblemEngagement(problemId, problem);
        
        // Convert Problem to ProblemDTO
        ProblemDTO problemDTO = convertToProblemDTO(problem);
        
        // Build response DTO
        ProblemCodeResponceDTO response = new ProblemCodeResponceDTO();
        response.setProblemDTO(problemDTO);
        response.setSavedCodes(engagement.getSavedCodes());
        response.setTotalSecondsSpent(engagement.getTotalSecondsSpent());
        response.setJavaTimeSeconds(engagement.getJavaTimeSeconds()!=null? engagement.getJavaTimeSeconds() : 0);
        response.setPythonTimeSeconds(engagement.getPythonTimeSeconds()!=null? engagement.getPythonTimeSeconds() : 0);
        response.setTypescriptTimeSeconds(engagement.getTypescriptTimeSeconds()!=null? engagement.getTypescriptTimeSeconds() : 0);
        response.setJavascriptTimeSeconds(engagement.getJavascriptTimeSeconds()!=null? engagement.getJavascriptTimeSeconds() : 0);
        response.setHint(problem.getHint());

        
        log.info("Successfully retrieved problem to solve for problemId: {}", problemId);
        return response;
    }

    private ProblemDTO convertToProblemDTO(Problem problem) {
        return ProblemDTO.builder()
                .problemId(problem.getProblemId())
                .hint(problem.getHint())

                .title(problem.getTitle())
                .description(problem.getDescription())
                .difficulty(problem.getDifficulty())
                .testCases(problem.getTestCases().stream()
                        .map(tc -> ProblemTestCaseDTO.builder()
                                .testCaseId(tc.getTestCaseId())
                                .input(tc.getInput())
                                .expectedOutput(tc.getExpectedOutput())
                                .isPublic(tc.getIsPublic())
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }

    private UserProblemEngagement getOrCreateUserProblemEngagement(Integer problemId, Problem problem) {
        UserProblemEngagement engagement = userProblemEngagementRepository
                .findById_UserIdAndId_ProblemId(userId, problemId)
                .orElse(null);
        
        if (engagement == null) {
            log.info("Creating new UserProblemEngagement for userId: {} and problemId: {}", userId, problemId);
            engagement = new UserProblemEngagement();
            
            UserProblemEngagementId engagementId = new UserProblemEngagementId();
            engagementId.setProblemId(problemId);
            engagementId.setUserId(userId);
            
            engagement.setId(engagementId);
            engagement.setProblem(problem);
            

            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            engagement.setUser(user);
            
            engagement = userProblemEngagementRepository.save(engagement);
        }
        
        return engagement;
    }

    @Override
    @Transactional
    public void saveCodeAndTime(SaveCodeAndTimeRequest request) {
        log.info("💾 Saving codes and time for problemId: {} | userId: {}", request.getProblemId(), userId);

        UserProblemEngagement engagement = userProblemEngagementRepository
                .findById_UserIdAndId_ProblemId(userId, request.getProblemId())
                .orElseGet(() -> {
                    log.info("Creating new UserProblemEngagement for problem {}", request.getProblemId());
                    User user = userRepository.findByUserId(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    Problem problem = problemRepository.findById(request.getProblemId())
                            .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));

                    UserProblemEngagement newEngagement = new UserProblemEngagement();
                    UserProblemEngagementId id = new UserProblemEngagementId();
                    id.setUserId(userId);
                    id.setProblemId(request.getProblemId());

                    newEngagement.setId(id);
                    newEngagement.setUser(user);
                    newEngagement.setProblem(problem);
                    newEngagement.setLastActivityAt(LocalDateTime.now());
                    newEngagement.setTotalSecondsSpent(0);
                    newEngagement.setJavaTimeSeconds(0L);
                    newEngagement.setPythonTimeSeconds(0L);
                    newEngagement.setJavascriptTimeSeconds(0L);
                    newEngagement.setTypescriptTimeSeconds(0L);
                    return newEngagement;
                });

        // Update saved codes
        if (request.getSavedCodes() != null) {
            engagement.setSavedCodes(request.getSavedCodes());
        }

        // Get current values with null safety
        long currentJava = engagement.getJavaTimeSeconds() != null ? engagement.getJavaTimeSeconds() : 0L;
        long currentPython = engagement.getPythonTimeSeconds() != null ? engagement.getPythonTimeSeconds() : 0L;
        long currentJs = engagement.getJavascriptTimeSeconds() != null ? engagement.getJavascriptTimeSeconds() : 0L;
        long currentTs = engagement.getTypescriptTimeSeconds() != null ? engagement.getTypescriptTimeSeconds() : 0L;

        // Get increments from request with null safety
        long incJava = request.getJavaTimeSeconds() != null ? request.getJavaTimeSeconds() : 0L;
        long incPython = request.getPythonTimeSeconds() != null ? request.getPythonTimeSeconds() : 0L;
        long incJs = request.getJavascriptTimeSeconds() != null ? request.getJavascriptTimeSeconds() : 0L;
        long incTs = request.getTypescriptTimeSeconds() != null ? request.getTypescriptTimeSeconds() : 0L;

        // Apply increments (accumulate time deltas)
        long newJava = currentJava + incJava;
        long newPython = currentPython + incPython;
        long newJs = currentJs + incJs;
        long newTs = currentTs + incTs;

        // Set new accumulated values
        engagement.setJavaTimeSeconds(newJava);
        engagement.setPythonTimeSeconds(newPython);
        engagement.setJavascriptTimeSeconds(newJs);
        engagement.setTypescriptTimeSeconds(newTs);

        // Calculate total time spent with overflow protection
        long totalLong = newJava + newPython + newJs + newTs;
        int total;
        if (totalLong > Integer.MAX_VALUE) {
            log.warn("⚠️ Total time exceeds Integer.MAX_VALUE, clamping to max value");
            total = Integer.MAX_VALUE;
        } else {
            total = (int) totalLong;
        }

        // Update total and last activity
        engagement.setTotalSecondsSpent(total);
        engagement.setLastActivityAt(LocalDateTime.now());

        // 🔧 FIX: Actually save to database!
        userProblemEngagementRepository.save(engagement);

        log.info("✅ Codes and time saved successfully for problem {} | Java: {}s (+{}s) | Python: {}s (+{}s) | JS: {}s (+{}s) | TS: {}s (+{}s) | Total: {}s",
                request.getProblemId(),
                newJava, incJava,
                newPython, incPython,
                newJs, incJs,
                newTs, incTs,
                total);
    }



    @Override

    @Transactional
    public boolean saveSubmission(ProblemSubmissionRequestDTO problemSubmissionRequestDTO) {
        log.info("Saving submission for problemId: {}, userId: {}, language: {}",
                problemSubmissionRequestDTO.getProblemId(), userId, problemSubmissionRequestDTO.getLanguage());

        try {
            Integer problemId = problemSubmissionRequestDTO.getProblemId();
            Language language = problemSubmissionRequestDTO.getLanguage();
            Boolean isCorrect = problemSubmissionRequestDTO.getIsCorrect();
            Integer timeSpent = Optional.ofNullable(problemSubmissionRequestDTO.getTotalSecondsSpent()).orElse(0);



            Problem problem = problemRepository.findById(problemId)
                    .orElseThrow(() -> new ResourceNotFoundException("Problem not found"));
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));


            UserProblemReport userProblemReport = getOrCreateUserProblemReport(problemId);
            log.debug("UserProblemReport found/created: {}", userProblemReport.getUserProblemReportId());


            UserProblemEngagement engagement = getOrCreateUserProblemEngagement(problemId, problem);
            log.debug("UserProblemEngagement found/created: {}", engagement.getId());


            SavedCodes savedCodes = Optional.ofNullable(engagement.getSavedCodes()).orElse(new SavedCodes());
//            savedCodes = updateSavedCodes(savedCodes, language, problemSubmissionRequestDTO.getCode());
            engagement.setSavedCodes(problemSubmissionRequestDTO.getSavedCodes());

            updateLanguageSpecificStats(engagement, language, timeSpent, isCorrect);


            engagement.setTotalAttempts(engagement.getTotalAttempts() + 1);
            engagement.setLastActivityAt(LocalDateTime.now());
            userProblemEngagementRepository.save(engagement);


            ProblemSubmission submission = problemSubmissionRepository
                    .findByProblem_ProblemIdAndUser_UserIdAndLanguage(problemId, userId, language)
                    .orElse(new ProblemSubmission());


            if (submission.getIsSolved() != null && submission.getIsSolved() && !isCorrect) {
                log.info("Skipping overwrite: submission already solved and new one incorrect");
                return false;
            }

            submission.setProblem(problem);
            submission.setUser(user);
            submission.setLanguage(language);
            submission.setCode(problemSubmissionRequestDTO.getCode());
            submission.setTotalTestCases(
                    Optional.ofNullable(problemSubmissionRequestDTO.getTotalTestCases()).orElse(0));
            submission.setPassedTestCases(
                    Optional.ofNullable(problemSubmissionRequestDTO.getTotalTestCasesPassed()).orElse(0));
            submission.setInsights(problemSubmissionRequestDTO.getInsights());
            submission.setIsSolved(isCorrect);
            submission.setUserProblemReport(userProblemReport);
            submission.setSubmittedAt(LocalDateTime.now());

            problemSubmissionRepository.save(submission);


            userProblemReport.getLanguagesUsed().add(language);
            userProblemReport.setTotalAttempts(userProblemReport.getTotalAttempts() + 1);
            if (Boolean.TRUE.equals(isCorrect)) {
                userProblemReport.setSolved(true);
                // CRITICAL FIX: Update UserProblemEngagement.isSolved when problem is solved
                engagement.setIsSolved(true);
            }
            userProblemReportRepository.save(userProblemReport);

            log.info(" Submission processed successfully for problemId={}, user={}, language= {}",
                    problemId, userId, language);

            System.out.println(Boolean.TRUE.equals(isCorrect));
            if (Boolean.TRUE.equals(isCorrect)) {
                log.info("Triggering async LLM insight generation for user={}, problem={}", userId, problemId);
                problemReportService.generateInsightAsync(user, problem);
            }

            return true;

        } catch (Exception e) {
            log.error(" Error saving submission: {}", e.getMessage(), e);
            throw e;
        }
    }
    private void updateLanguageSpecificStats(UserProblemEngagement engagement, Language language,
                                             Integer timeSpent, Boolean isCorrect) {
        switch (language) {
            case JAVA -> {
                engagement.setJavaTimeSeconds(engagement.getJavaTimeSeconds() + timeSpent);
                if (Boolean.TRUE.equals(isCorrect)) engagement.setJavaCompleted(true);
            }
            case PYTHON -> {
                engagement.setPythonTimeSeconds(engagement.getPythonTimeSeconds() + timeSpent);
                if (Boolean.TRUE.equals(isCorrect)) engagement.setPythonCompleted(true);
            }
            case JAVASCRIPT -> {
                engagement.setJavascriptTimeSeconds(engagement.getJavascriptTimeSeconds() + timeSpent);
                if (Boolean.TRUE.equals(isCorrect)) engagement.setJavascriptCompleted(true);
            }
            case TYPESCRIPT -> {
                engagement.setTypescriptTimeSeconds(engagement.getTypescriptTimeSeconds() + timeSpent);
                if (Boolean.TRUE.equals(isCorrect)) engagement.setTypescriptCompleted(true);
            }
        }
    }
    private UserProblemReport getOrCreateUserProblemReport(Integer problemId) {
        return userProblemReportRepository.findByUser_UserIdAndProblem_ProblemId(userId, problemId)
                .orElseGet(() -> {
                    Problem problem = problemRepository.findById(problemId)
                            .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));
                    User user = userRepository.findByUserId(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
                            
                    UserProblemReport report = new UserProblemReport();
                    report.setProblem(problem);
                    report.setUser(user);
                    report.setTotalAttempts(0);
                    report.setSolved(false);

                    //TODO:This has to be removed
                    ObjectMapper mapper = new ObjectMapper();
                    ObjectNode body = mapper.createObjectNode();
                    body.put("msg", "Time complexity can be improved");
                    report.setInsight(body);

                    report.setLanguagesUsed(new java.util.HashSet<Language>());
                    
                    return userProblemReportRepository.save(report);
                });
    }
    @Override
    @Transactional(readOnly = true)
    public List<ProblemSubmissionResponceDTO> getAllSubmissions(Integer problemId) {
        log.info("Fetching all submissions for problemId: {} and userId: {}", problemId, userId);

        // Get all submissions for the current user and problem
        List<ProblemSubmission> submissions = problemSubmissionRepository.findByProblem_ProblemIdAndUser_UserId(problemId, userId);

        // Map each submission to DTO
        return submissions.stream()
                .map(submission -> ProblemSubmissionResponceDTO.builder()
                        .problemId(submission.getProblem().getProblemId())
                        .language(submission.getLanguage().name())
                        .code(submission.getCode())
                        .isCorrect(submission.getIsSolved())
                        .totalTestCasesPassed(submission.getPassedTestCases())
                        .totalTestCases(submission.getTotalTestCases())
                        .insights(submission.getInsights())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public ProblemCodeResponceDTO getMainTopicProblem(Integer mainTopicId) {
        // Fetch the problem associated with the given main topic
        Optional<Problem> mainProblemOpt = problemRepository.findProblemByMainTopicId(mainTopicId);

        Problem problem = mainProblemOpt.orElseThrow(() ->
                new ResourceNotFoundException("Main topic problem not found"));

        // Convert to response DTO (you already have a helper like getProblemToSolve)
        return getProblemToSolve(problem.getProblemId());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MainTopicSubTopicsResponceDTO> getAllProblems() {
        // Get all main topics
        List<MainTopic> mainTopics = mainTopicRepository.findAll();
        
        return mainTopics.stream()
                .map(mainTopic -> {
                    MainTopicSubTopicsResponceDTO dto = new MainTopicSubTopicsResponceDTO();
                    dto.setMainTopicId(mainTopic.getMainTopicId());
                    dto.setMainTopicName(mainTopic.getTitle());
                    dto.setMainTopicDescription(mainTopic.getDescription());
                    
                    // Get all subtopics for this main topic
                    List<Topic> subtopics = topicRepository.findAllByMainTopicIdWithMainTopic(mainTopic.getMainTopicId());
                    
                    // Convert subtopics to DTOs with their problems
                    List<TopicDTO> subtopicDTOs = subtopics.stream()
                            .map(subtopic -> {
                                TopicDTO subtopicDTO = new TopicDTO();
                                subtopicDTO.setTopicId(subtopic.getTopicId());
                                subtopicDTO.setTitle(subtopic.getTitle());
                                
                                // Get all problems for this subtopic
                                List<Problem> problems = problemRepository.findByTopicIdAndNotMainTopic(subtopic.getTopicId());

                                // Convert problems to ProblemInfoDTO
                                List<ProblemInfoDTO> problemDTOs = problems.stream()
                                        .map(problem -> new ProblemInfoDTO(
                                                problem.getProblemId(),
                                                problem.getTitle()
                                        ))
                                        .collect(Collectors.toList());
                                
                                // Add problems to the subtopic DTO
                                // Note: We need to add a field for problems in TopicDTO or create a new DTO
                                // For now, we'll use a workaround by setting the content field
                                ObjectMapper mapper = new ObjectMapper();
                                try {
                                    ObjectNode content = mapper.createObjectNode();
                                    content.putPOJO("problems", problemDTOs);
                                    subtopicDTO.setContent(content);
                                } catch (Exception e) {
                                    log.error("Error creating content for topic: " + subtopic.getTopicId(), e);
                                }

                                return subtopicDTO;
                            })
                            .collect(Collectors.toList());
                    
                    dto.setSubTopics(subtopicDTOs);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProblemSubmissionResponceDTO> getUserSubmissions() {
        log.info("Fetching all submissions for logged-in user: {}", userId);
        return getUserSubmissions(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProblemSubmissionResponceDTO> getUserSubmissions(String userId) {
        log.info("Fetching all submissions for userId: {}", userId);

        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Get all submissions for the user (across all problems)
        List<ProblemSubmission> submissions = problemSubmissionRepository.findAll().stream()
                .filter(submission -> submission.getUser().getUserId().equals(userId))
                .collect(Collectors.toList());

        // Map to DTOs
        return submissions.stream()
                .map(submission -> ProblemSubmissionResponceDTO.builder()
                        .problemId(submission.getProblem().getProblemId())
                        .language(submission.getLanguage().name())
                        .code(submission.getCode())
                        .isCorrect(submission.getIsSolved())
                        .totalTestCasesPassed(submission.getPassedTestCases())
                        .totalTestCases(submission.getTotalTestCases())
                        .insights(submission.getInsights())
                        .build())
                .collect(Collectors.toList());
    }

}
