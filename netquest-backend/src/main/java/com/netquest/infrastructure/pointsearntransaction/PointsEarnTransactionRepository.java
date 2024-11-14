package com.netquest.infrastructure.pointsearntransaction;

import com.netquest.domain.pointsearntransaction.model.PointsEarnTransaction;
import com.netquest.domain.pointsearntransaction.model.PointsEarnTransactionId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointsEarnTransactionRepository extends JpaRepository<PointsEarnTransaction, PointsEarnTransactionId> {
}
