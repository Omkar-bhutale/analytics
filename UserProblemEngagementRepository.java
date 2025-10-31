package com.ignite.CBL.repository;

import com.ignite.CBL.dto.ProblemInfoDTO;
import com.ignite.CBL.entity.UserProblemEngagement;
import com.ignite.CBL.entity.UserProblemEngagementId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProblemEngagementRepository extends JpaRepository<UserProblemEngagement, UserProblemEngagementId> {
    Optional<UserProblemEngagement> findById_UserIdAndId_ProblemId(String userId, Integer problemId);

    @Query("""
    SELECT new com.ignite.CBL.dto.ProblemInfoDTO(
        upe.problem.problemId,
        upe.problem.title
    )
    FROM UserProblemEngagement upe
    WHERE upe.user.userId = :userId AND upe.isSolved = true
""")
    List<ProblemInfoDTO> findUserSolvedProblems(@Param("userId") String userId);
}
