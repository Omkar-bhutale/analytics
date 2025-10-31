package com.ignite.CBL.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.ignite.CBL.dto.ProblemInfoDTO;
import com.ignite.CBL.dto.UserDashboardResponceDTO;
import com.ignite.CBL.dto.UserProblemStats;
import com.ignite.CBL.service.AdminDashboardService;
import com.ignite.CBL.service.ProblemSubmissionService;
import com.ignite.CBL.service.UserDashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@Tag(
        name = "Admin Dashboard Controller",
        description = "APIs for administrative dashboard operations and statistics"
)
public class AdminDashboardController {

    private final UserDashboardService userDashboardService;
    private final AdminDashboardService adminDashboardService;

    private final ProblemSubmissionService problemSubmissionService;

    @Operation(
            summary = "Get all users dashboard data",
            description = "Retrieves comprehensive dashboard data for all users including their problem solving statistics",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved all users dashboard data",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = UserDashboardResponceDTO.class, type = "array")
                            )
                    )
            }
    )
    @GetMapping
    public ResponseEntity<List<UserDashboardResponceDTO>> getAllUsersDashboard() {
        List<UserDashboardResponceDTO> allUsersDashboard = userDashboardService.getAllUsersDashboard();
        return ResponseEntity.ok(allUsersDashboard);
    }

    @Operation(
            summary = "Get user statistics by ID",
            description = "Retrieves detailed statistics for a specific user including problem counts by difficulty and language",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved user statistics",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = Map.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "User not found with the specified ID",
                            content = @Content
                    )
            }
    )
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getUserStats(
            @Parameter(
                    description = "Unique identifier of the user",
                    required = true,
                    example = "user123"
            )
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(userDashboardService.getUserDashboardStats(userId));
    }

    @Operation(
            summary = "Get all users' problem statistics",
            description = "Retrieves problem solving statistics for all users, including counts by language and difficulty",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved all users' problem statistics",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = UserProblemStats.class, type = "array")
                            )
                    )
            }
    )
    @GetMapping("/all-users-stats")
    public ResponseEntity<List<UserProblemStats>> getAllUsersWithProblemStats() {
        return ResponseEntity.ok(userDashboardService.getAllUsersWithProblemStats());
    }

    @GetMapping("/problemInfo/{userId}")
    public ResponseEntity<List<ProblemInfoDTO>> getProblemInfoDto(@PathVariable("userId") String userId){
        return ResponseEntity.ok(adminDashboardService.fetchUserProblemSolvedInfo(userId));
    }

    @Operation(
            summary = "Get total platform statistics",
            description = "Retrieves aggregated statistics across all users and problems",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved platform statistics",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = Map.class)
                            )
                    )
            }
    )
    @GetMapping("/platform-stats")
    public ResponseEntity<Map<String, Object>> getPlatformStatistics() {

        return ResponseEntity.ok(Map.of(
                "totalUsers", adminDashboardService.countTotalUsers(),
                "totalProblems", adminDashboardService.countTotalProblems(),
                "totalSubmissions", adminDashboardService.countTotalSubmissions(),
                "totalSolvedInJava", adminDashboardService.countTotalSolvedInJava(),
                "totalSolvedPython", adminDashboardService.countTotalSolvedPython(),
                "totalSolvedJavaScript", adminDashboardService.countTotalSolvedJavaScript(),
                "totalSolvedTypeScript", adminDashboardService.countTotalSolvedTypeScript()
        ));
    }
    @GetMapping("/user-problem-report")
    public ResponseEntity<JsonNode> getUserInsight(@RequestParam("userId") String userId, @RequestParam("problemId") Integer problemId){
        return ResponseEntity.ok(adminDashboardService.getUserProblemInsight(userId,problemId));
    }

    @Operation(
            summary = "Get all submissions for a specific user",
            description = "Retrieves all problem submissions made by a specific user across all problems, including code, language, test results, and AI-generated insights",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Successfully retrieved user submissions",
                            content = @Content(
                                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                                    schema = @Schema(implementation = com.ignite.CBL.dto.ProblemSubmissionResponceDTO.class, type = "array")
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "User not found with the specified ID",
                            content = @Content
                    )
            }
    )
    @GetMapping("/user-submissions/{userId}")
    public ResponseEntity<List<com.ignite.CBL.dto.ProblemSubmissionResponceDTO>> getUserSubmissions(
            @Parameter(
                    description = "Unique identifier of the user",
                    required = true,
                    example = "2918705"
            )
            @PathVariable String userId
    ) {
        return ResponseEntity.ok(problemSubmissionService.getUserSubmissions(userId));
    }

}