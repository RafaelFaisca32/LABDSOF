package com.netquest.infrastructure.pointsearntransaction;

import com.netquest.domain.pointsearntransaction.dto.PointsEarnTransactionDto;
import com.netquest.domain.pointsearntransaction.dto.TotalPointsEarnByUserDto;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransactionId;
import com.netquest.domain.user.model.UserId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PointsEarnTransactionRepository extends JpaRepository<PointsEarnTransaction, PointsEarnTransactionId> {

    @Query("SELECT new com.netquest.domain.pointsearntransaction.dto.TotalPointsEarnByUserDto(p.userId.value, SUM(p.pointsEarnTransactionAmount.value)) " +
            "FROM PointsEarnTransaction p " +
            " inner join User u on u.userId.value = p.userId.value " +
            " GROUP BY p.userId " +
            " ORDER BY SUM(p.pointsEarnTransactionAmount.value) DESC, u.username.userName desc")
    Page<TotalPointsEarnByUserDto> getLeaderboard(Pageable pageable);


    Page<PointsEarnTransaction> findByUserIdOrderByPointsEarnTransactionDateTimeDesc(UserId userId, Pageable pageable);
}

